import { createConnection, ConnectionOptions } from 'typeorm';
import 'dotenv/config'

export const datasource: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'ms-login',
    entities: [
        __dirname + '/src/models/*.ts'
    ],
    synchronize: true,
};

export async function connectDatabase(): Promise<void> {
    try {
        await createConnection(datasource);
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.log('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}
