import {AuthService} from "../services/AuthService";
import User from "../models/User";

const authService = new AuthService()
export class AuthController {
    async login(req: any, reply: any) {
        return await authService.login(req, reply)
    }
    async register(req: any, reply: any) {
        return await authService.register(req, reply)
    }
    async authenticateToken(req: any, reply: any, next: any) {
        return await authService.authenticateToken(req, reply, next)
    }
    async logout(req: any, reply: any) {
        return await authService.logout(req, reply);
    }
    async deleteAccount(req: any, reply: any) {
        return await authService.deleteAccount(req, reply);
    }
}
