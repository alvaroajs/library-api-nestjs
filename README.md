# API de Biblioteca Digital (Teste Técnico)

Esta é uma API REST desenvolvida em NestJS como parte de um teste técnico. O objetivo é gerenciar uma pequena biblioteca digital, controlando o cadastro de livros, usuários e o fluxo de empréstimos e devoluções.

## ✨ Features

- ✅ **Gerenciamento de Livros**: Cadastro, listagem (com filtros por status e título) e atualização de status (`BORROWED (Emprestado)` e `AVAILABLE (Disponível)`).
- ✅ **Gerenciamento de Usuários**: Cadastro de novos usuários.
- ✅ **Sistema de Empréstimos**: Registro de empréstimos e devoluções.
- ✅ **Validação de Dados**: Uso de DTOs com `class-validator` para garantir a integridade dos dados de entrada.
- ✅ **Estrutura Modular**: Código organizado em módulos para cada entidade (`books`, `users`, `loans`).
- ✅ **Testes Unitários**: Testes com Jest para a lógica de negócio principal, garantindo que regras como "não emprestar um livro já emprestado" sejam respeitadas.

## 🛠️ Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **Testes**: [Jest](https://jestjs.io/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## 🏛️ Arquitetura e Decisões de Projeto

Este projeto foi construído seguindo os padrões e as melhores práticas do ecossistema NestJS para garantir um código limpo, escalável e de fácil manutenção.

### Arquitetura Modular

A aplicação é dividida em módulos que representam os domínios da aplicação: `BooksModule`, `UsersModule` e `LoansModule`. Cada módulo encapsula seus próprios `controllers`, `services` e `DTOs`, promovendo uma forte separação de responsabilidades (Separation of Concerns) e facilitando a reutilização de código.

### Injeção de Dependência (DI)

O framework NestJS utiliza intensivamente o padrão de Injeção de Dependência. Em todo o projeto, as dependências (como um `Service` que é usado por um `Controller`, ou o `PrismaService` que é usado por outros services) são injetadas através do construtor. Isso desacopla os componentes, tornando o código mais testável e flexível, pois as dependências podem ser facilmente substituídas por "mocks" durante os testes unitários.

### Padrão de Camada de Serviço (Service Layer)

Toda a lógica de negócio e a comunicação com o banco de dados estão isoladas nas classes de **Serviço** (`BooksService`, `UsersService`, `LoansService`). Os **Controllers** são responsáveis apenas por receber as requisições HTTP, validar os dados de entrada (através dos DTOs) e delegar a execução para a camada de serviço. Isso mantém os controllers "magros" (lean) e a lógica de negócio centralizada e reutilizável.

### DTOs e Validação na Camada de Entrada

Para garantir a integridade dos dados que chegam à API, foram utilizados Data Transfer Objects (DTOs) em conjunto com as bibliotecas `class-validator` e `class-transformer`. Através de um `ValidationPipe` global, o NestJS valida automaticamente todos os corpos de requisição, rejeitando dados malformados ou inválidos antes mesmo de chegarem à lógica de negócio, tornando a aplicação mais robusta e segura.

### Transações para Consistência de Dados

Operações críticas que envolvem múltiplas escritas no banco de dados, como o registro de um empréstimo (que precisa criar um registro de `Loan` e ao mesmo tempo atualizar o status de um `Book`), são envolvidas em uma transação do Prisma (`prisma.$transaction`). Isso garante a atomicidade da operação: ou ambas as escritas são bem-sucedidas, ou nenhuma delas é aplicada. Isso previne que o banco de dados entre em um estado inconsistente.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v16 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (Opcional, mas recomendado para rodar o PostgreSQL) ou uma instância local do PostgreSQL.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/alvaroajs/back_PTCI 

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    - Renomeie o arquivo `.env.example` para `.env`.
    - Abra o arquivo `.env` e substitua a `DATABASE_URL` pela sua string de conexão do PostgreSQL.
    ```env
    # Exemplo de DATABASE_URL
    DATABASE_URL="postgresql://SEU_USER:SUA_SENHA@localhost:5432/SUA_DATABASE?schema=public"
    ```

4.  **Execute as Migrations do Banco de Dados:**
    - Este comando vai criar o schema do banco de dados baseado no arquivo `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Inicie a Aplicação:**
    ```bash
    npm run start:dev
    ```
    - O servidor estará rodando em `http://localhost:3000`.

## 🧪 Testes

A aplicação conta com dois tipos de testes para garantir sua qualidade e funcionamento.

### Testes Unitários (Jest)

Foram criados testes unitários com Jest para a lógica de negócio mais crítica do sistema (no `LoansService`), garantindo que as regras de empréstimo são seguidas e os erros são tratados corretamente. Para executar os testes automatizados, use o comando:

```bash
npm run test
```

### Testes Manuais (Postman)

Todos os endpoints da API foram validados manualmente utilizando o [Postman](https://www.postman.com/) para simular o uso real da aplicação. Os testes manuais cobriram:

- O fluxo completo de CRUD para cada entidade (`users`, `books`, `loans`).
- Os filtros de busca por título e status na listagem de livros.
- As validações de erro, como tentar cadastrar um e-mail duplicado ou emprestar um livro já emprestado (erros `409 Conflict`).
- O ciclo completo de um empréstimo: criação, verificação de status e devolução.

## 📖 Endpoints da API

Aqui está um resumo dos endpoints disponíveis:

| Método | Rota                   | Descrição                                         |
| :----- | :--------------------- | :------------------------------------------------ |
| `POST` | `/users`               | Cadastra um novo usuário.                         |
| `POST` | `/books`               | Cadastra um novo livro.                           |
| `GET`  | `/books`               | Lista todos os livros. Aceita filtros `?status=` e `?title=`. |
| `PATCH`| `/books/:id/status`    | Atualiza o status de um livro (`AVAILABLE` ou `BORROWED`). |
| `POST` | `/loans`               | Registra um novo empréstimo.                      |
| `PATCH`| `/loans/:id/return`    | Marca um empréstimo como devolvido.               |
