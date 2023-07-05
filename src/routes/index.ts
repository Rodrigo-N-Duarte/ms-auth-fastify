import { FastifyInstance } from 'fastify';
import {UserController} from "../controllers/UserController";
import {AuthController} from "../controllers/AuthController";
async function routes(fastify: FastifyInstance): Promise<void> {

    const userController = new UserController()
    const authController = new AuthController()

    // fastify.get('/', {preHandler: authController.authenticateToken}, userController.res)

    // User
    fastify.get('/user', userController.findAll);
    fastify.get('/user/:id', userController.findById);
    fastify.post('/user', userController.createUser);
    fastify.put('/user', userController.updateUser);

    // Auth
    fastify.post("/auth/login", authController.login);
    fastify.post("/auth/register", authController.register)
    fastify.post("/auth/logout/:id", authController.logout)
    fastify.delete("/auth/delete/:id", authController.deleteAccount)
}

export default routes;
