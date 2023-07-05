import User from "../models/User";
export class UserService {
    async findAll(req: any, reply: any) {
        return await User.find();
    }
    async findById(req: any, reply: any) {
        return await User.findById(req.params.id);
    }
    async createUser(req: any, reply: any) {
        const body = req.body
        const user: User | null = await User.findByEmail(body.email)
        if (!user) {
            try {
                const newUser = new User()
                newUser.name = body.name
                newUser.email = body.email
                newUser.password = body.password
                await newUser.save()
                return reply.send(newUser)
            } catch (e) {
                return reply.status(400).send(e)
            }
        }
        return reply.status(400).send(new Error("Usuário não encontrado"))
    }

     async updateUser(req: any, reply: any) {
         const body = req.body
         const user: User | null = await User.findById(body.id)
         if (user) {
             try {
                 user.name = body.name
                 user.email = body.email
                 user.password = body.password
                 await user.save()
                 return reply.send(user)
             } catch (e) {
                 return reply.status(400).send(e)
             }
         }
         return reply.status(400).send(new Error("Ocorreu um erro na operação"))
     }
}
