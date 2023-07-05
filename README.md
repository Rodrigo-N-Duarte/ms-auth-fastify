# Login Service NodeJS

MIcro serviço com node e typescript usando jwt-token e bcrypt para o salvamento no banco de dados.

## Installation

Clone o projeto e execute o comando:

```bash
npm install
```

## Usage

Crie um arquivo .env na raiz do projeto e preencha os dados com as configurações da sua máquina seguindo o padrão abaixo:

```dotenv
JWT_TOKEN=senhasupersecreta

DB_PORT=5432
DB_USERNAME="user"
DB_PASSWORD="password"
```

Também crie um banco de dados no postgresql na sua máquina, chamado 'ms-email'.

#### Criar usuário

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

#### Fazer login

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

#### Deletar usuário

```http
  DELETE /auth/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Obrigatório**. Id usuário. |


