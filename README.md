Essa é uma aplicação NodeJS com framework Nest e contém dependências com PostgreSQL, RabbitMQ e Redis (Todos com Docker já na raiz do projeto).

## Pré-requisitos

- Docker e NodeJS instalados

## Documentação

Toda documentação sobre os endpoints pode encontrar em `localhost:3000/api` (ou na porta que você rodou `/api`).

## Arquitetura

A aplicação segue a arquitetura limpa de certo modo, dividida a aplicação em domínios (módulos) e cada módulo tem sua camada seguindo a arquitetura limpa (aplicação, domínio, infra e apresentação).

## Como rodar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run start:dev
```

**Nota:** Para rodar em ambiente de desenvolvimento, é necessário ter o PostgreSQL, Redis e RabbitMQ rodando.

### Docker

```bash
docker-compose up -d
```

Execute na raiz do projeto para subir a infra (irá rodar a aplicação também). Se quiser rodar em ambiente de dev a aplicação, pare a aplicação do Docker e rode em dev ou rode em outra porta.

## Variáveis de Ambiente

As variáveis de ambiente necessárias estão configuradas no arquivo `docker-compose.yml` e também podem ser definidas via arquivo `.env.example`.

## Banco de Dados

No PostgreSQL temos duas tabelas:
- **users**: Guarda os usuários
- **access_logs**: Guarda os acessos

Esses acessos também são publicados em uma fila no RabbitMQ chamada `access_logs`.

## Migrations

A aplicação utiliza TypeORM para gerenciamento de migrations. As migrations estão localizadas na pasta `src/migrations/`.

### Executar migrations

Rode as migrations antes de rodar a aplicação a primeira vez, para que vc tenha as tabelas e o usuario padrao! Ou entao crie na mão rsrsrs

```bash
npm run migration:run
```

As migrations disponíveis são:
- **CreateUsersTable**: Cria as tabelas `users` e `access_logs`
- **InsertDefaultAdmin**: Insere o usuário admin padrão no banco de dados

## Usuário Default

A aplicação possui um usuário admin padrão criado automaticamente via migration:

- **Email**: `admin@priimetech.com`
- **Senha**: `admin`
- **Role**: `admin`

Este usuário pode ser usado para fazer login e acessar os recursos da aplicação.

## Autenticação

### Redis

Ao usuário fazer login na aplicação é guardado o token no Redis e reutilizado quando necessário para não sobrecarregar o banco.

### Logout

Ao usuário fazer logout, todos os tokens do cache são removidos.