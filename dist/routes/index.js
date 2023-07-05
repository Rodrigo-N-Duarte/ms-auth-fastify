"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function routes(fastify) {
    fastify.get('/', async (_request, reply) => {
        return { message: 'Bem-vindo à API Fastify!' };
    });
}
exports.default = routes;
