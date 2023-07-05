import 'reflect-metadata';
import Fastify from 'fastify';
import routes from "./src/routes";
import {connectDatabase} from "./dbconfig";
import cors from '@fastify/cors'

const fastify = Fastify({
    logger: true
});

fastify.register(cors)
fastify.register(routes);

connectDatabase().then(() => {
    fastify.listen({ port: 3000 }, function (err, address) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        console.log(`Servidor rodando em ${address}`);
    });
});