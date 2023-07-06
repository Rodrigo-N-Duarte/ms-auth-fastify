# Login Service NodeJS

Microservice com node e typescript usando jwt-token e bcrypt para o salvamento no banco de dados.

## Installation

Clone o projeto e execute o comando:

```bash
npm install
```

Crie um arquivo .env na raiz do projeto e preencha os dados com as configurações da sua máquina seguindo o padrão abaixo:

```dotenv
JWT_TOKEN=senha-super-ultra-mega-secreta ## Segredo do jwt-token

DB_PORT=5432 ## Porta padrão do postgresql
DB_USERNAME=user ## Username postgresql
DB_PASSWORD=password ## Password postgresql
```

Também crie um banco de dados no postgresql na sua máquina, chamado 'ms-login'.

## Usage

Versão do node recomendada: 20

Start:
```bash
npm start
```

## Routes

#### - Criar usuário

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Obrigatório**. Nome do novo usuário. |
| `email` | `string` | **Obrigatório**. Email do novo usuário. |
| `password` | `string` | **Obrigatório**. Senha do novo usuário. |
| `confirmPassword` | `string` | **Obrigatório**. Confirmação de senha. |

```json
{
    "name": "Rodrigo",
    "email": "email@gmail.com",
    "password": "123456",
    "confirmPassword": "123456"
}
```

#### - Fazer login

```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário. |
| `password` | `string` | **Obrigatório**. Senha do usuário. |

```json
{
    "email": "email@gmail.com",
    "password": "123456"
}
```

#### - Deletar usuário

```http
  DELETE /auth/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Obrigatório**. Id usuário. |

## Routes com autorização do JWT

#### - Get user por ID
```http
  GET /user/:id
```
#### - Get all users
```http
  GET /user
```
#### - Update user por ID
```http
  PUT /user/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Obrigatório**. Id usuário. |

#### ⚠️ Importante: Nessas três rotas é necessário informar o jwt-token no ['authorization'] nos headers da requisição, esse que é gerado quando o usuário faz login ou se cadastra. Se não, ocorrerá o erro de acesso negado.
