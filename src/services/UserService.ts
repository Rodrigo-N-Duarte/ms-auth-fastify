import User from "../models/User";
import {Messages} from "../utils/Messages";
import bcrypt from "bcrypt";

export class UserService {
    async findAll(req: any, reply: any) {
        let users: User[] | null = await User.find();
        if (users && users.length > 0) {
            users.map(user => delete user.password)
            return reply.send(users)
        }
        return reply.status(400).send(new Error(Messages.USUARIO_NAO_ENCONTRADO))
    }

    async findById(req: any, reply: any) {
        const user: User | null = await User.findById(req.params.id);
        if (user) {
            delete user.password
            return reply.send(user)
        }
        return reply.status(400).send(new Error(Messages.USUARIO_NAO_ENCONTRADO))
    }

    async updateUser(req: any, reply: any) {
        const {name, email, password} = req?.body
        try {
            const id: number = req.params.id
            const user: User | null = await User.findById(id)
            if (user) {
                user.name = name
                user.email = email
                const salt: any = await bcrypt.genSalt(12)
                const hash: any = await bcrypt.hash(password, salt)
                user.password = hash
                await user.save()
                return reply.send(user)
            }
            return reply.status(400).send(new Error(Messages.USUARIO_NAO_ENCONTRADO))
        } catch (e) {
            return reply.status(400).send(e)
        }
        return reply.status(400).send(new Error(Messages.ERRO))
    }
}
