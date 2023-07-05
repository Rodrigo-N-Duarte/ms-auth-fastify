import User from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import UserHistory from "../models/UserHistory";
import {UserHistoryEnum} from "../enums/UserHistoryEnum";
import 'dotenv/config'
export class AuthService {
    async authenticateToken(req: any, reply: any, next: any) {
        const [authorization] = req.headers
        const token = authorization && authorization?.split(' ')[1]
        if (!token) {
            return reply.status(401).send(new Error("Acesso negado"))
        }
        jwt.verify(token, String(process.env.JWT_SECRET), (err: any) => {
            if (err) return reply.status(403).send(new Error("Acesso negado com o token inserido"))
            next()
        })
    }

    async updateHistory(user: User, flag: UserHistoryEnum) {
        const userHistory: UserHistory = new UserHistory()
        userHistory.user = user
        userHistory.history = flag
        userHistory.dateTime = new Date()
        await userHistory.save()
    }

    async login(req: any, reply: any) {
        const {email, password} = req.body
        if (!email || !password) {
            return reply.status(422).send(new Error("Dados faltantes"))
        }
        const userExists: null | User = await User.findByEmail(email);
        if (userExists) {
            const passwordMatch = await bcrypt.compare(password, userExists.password)
            if (!passwordMatch) {
                return reply.status(404).send(new Error("Senha inválida"))
            }
            await this.updateHistory(userExists, UserHistoryEnum.LOGGED)
            const token = jwt.sign({uuid: userExists?.id}, String(process.env.JWT_SECRET))
            return reply.send(token)
        }
        return reply.status(422).send(new Error("Usuário não encontrado"))
    }

    async register(req: any, reply: any) {
        const {name, email, password, confirmPassword} = req.body
        try {
            const validation = await this.validRegister(name, email, password, confirmPassword)
            if (validation) {
                return reply.status(400).send(new Error(validation))
            }
            const salt: any = await bcrypt.genSalt(12)
            const hash: any = await bcrypt.hash(password, salt)
            const user: User = new User()
            user.name = name
            user.email = email
            user.password = hash
            await user.save()
            await this.updateHistory(user, UserHistoryEnum.REGISTERED)
            const token = jwt.sign({id: user?.id}, String(process.env.JWT_SECRET))
            return reply.send(token)
        }
        catch (e) {
            return reply.status(400).send(new Error("Ocorreu um erro na operação"))
        }
    }

    async logout(req: any, reply: any) {
        const id = req?.params?.id
        if (validator.isEmpty(id) || !validator.isNumeric(id)) {
            return reply.status(400).send(new Error("Id inválido"))
        }
        try {
            const user: User | null = await User.findById(id);
            if (user) {
                delete user.password
                await this.updateHistory(user, UserHistoryEnum.LOGOUT)
                return reply.send(user)
            }
        } catch (e) {
            return reply.status(400).send(e)
        }
        return reply.status(400).send(new Error("Ocorreu um erro na operação."))
    }

    async deleteAccount(req: any, reply: any) {
        const id = req?.params?.id
        if(validator.isEmpty(id) || !validator.isNumeric(id)) {
            return reply.status(400).send(new Error("Id inválido"))
        }
        try {
            const user: User | null = await User.findById(id)
            if (user) {
                await user.remove()
                delete user.password
                return reply.send(user)
            }
        } catch (e) {
            return reply.status(400).send(e)
        }
        return reply.status(400).send(new Error("Ocorreu um erro na operação."))
    }

    private async validRegister(name: string, email: string, password: string, confirmPassword: string) {
        let validation: string | null = null
        if (validator.isEmpty(name.trim()) || validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
            validation = "Dados faltantes"
        }
        const userExists: null | User = await User.findByEmail(email);
        if (userExists) {
            validation = "Email já existente, tente outro"
        }
        if (!validator.isEmail(email)) {
            validation = "Email inválido"
        }
        if (!validator.isLength(password, {min: 5, max: 20})) {
            validation = "A senha não pode ter mais que 20 caracteres nem ter menos que 5 dígitos"
        }
        if (password !== confirmPassword) {
            validation = "As senhas são diferentes"
        }
        return validation
    }
}
