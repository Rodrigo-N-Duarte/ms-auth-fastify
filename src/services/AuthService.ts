import User from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import UserHistory from "../models/UserHistory";
import {UserHistoryEnum} from "../enums/UserHistoryEnum";
import {Messages} from "../utils/Messages";
import 'dotenv/config'
export class AuthService {
    async authenticateToken(req: any, reply: any, next: any) {
        const authorization = req.headers['authorization']
        const token = authorization && authorization?.split(' ')[1]
        if (!token) {
            return reply.status(401).send(new Error(Messages.ACESSO_NEGADO))
        }
        jwt.verify(token, String(process.env.JWT_SECRET), (err: any) => {
            if (err) return reply.status(401).send(new Error(Messages.TOKEN_INVALIDO))
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
            return reply.status(422).send(new Error(Messages.DADOS_FALTANTES))
        }
        const userExists: null | User = await User.findByEmail(email);
        if (userExists) {
            const passwordMatch = await bcrypt.compare(password, userExists.password)
            if (!passwordMatch) {
                return reply.status(404).send(new Error(Messages.SENHA_INVALIDA))
            }
            await this.updateHistory(userExists, UserHistoryEnum.LOGGED)
            const token = jwt.sign({uuid: userExists?.id}, String(process.env.JWT_SECRET))
            return reply.send(token)
        }
        return reply.status(422).send(new Error(Messages.USUARIO_NAO_ENCONTRADO))
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
            return reply.status(400).send(new Error(Messages.ERRO))
        }
    }

    async logout(req: any, reply: any) {
        const id = req?.params?.id
        if (validator.isEmpty(id) || !validator.isNumeric(id)) {
            return reply.status(400).send(new Error(Messages.ID_INVALIDO))
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
        return reply.status(400).send(new Error(Messages.ERRO))
    }

    async deleteAccount(req: any, reply: any) {
        const id = req?.params?.id
        if(validator.isEmpty(id) || !validator.isNumeric(id)) {
            return reply.status(400).send(new Error(Messages.ID_INVALIDO))
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
        return reply.status(400).send(new Error(Messages.ERRO))
    }

    private async validRegister(name: string, email: string, password: string, confirmPassword: string) {
        let validation: string | null = null
        if (validator.isEmpty(name.trim()) || validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
            validation = Messages.DADOS_FALTANTES
        }
        const userExists: null | User = await User.findByEmail(email);
        if (userExists) {
            validation = Messages.EMAIL_JA_EXISTE
        }
        if (!validator.isEmail(email)) {
            validation = Messages.EMAIL_INVALIDO
        }
        if (!validator.isLength(password, {min: 5, max: 20})) {
            validation = Messages.SENHA_FORA_PADRAO
        }
        if (password !== confirmPassword) {
            validation = Messages.SENHAS_DIFERENTES
        }
        return validation
    }
}
