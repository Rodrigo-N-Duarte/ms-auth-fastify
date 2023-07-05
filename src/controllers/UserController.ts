import { FastifyRequest, FastifyReply } from 'fastify';
import {UserService} from "../services/UserService";

const userService = new UserService()
export class UserController {
    async findAll(req: FastifyRequest, reply: FastifyReply) {
        return await userService.findAll(req, reply);
    }
    async findById(req: FastifyRequest, reply: FastifyReply) {
        return await userService.findById(req, reply);
    }
    async updateUser(req: FastifyRequest, reply: FastifyReply) {
        return await userService.updateUser(req, reply);
    }
    async createUser(req: FastifyRequest, reply: FastifyReply) {
        return await userService.createUser(req, reply);
    }
}