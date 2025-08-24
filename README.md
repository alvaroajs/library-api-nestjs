# API de Biblioteca Digital (Teste Técnico)

Esta é uma API REST desenvolvida em NestJS como parte de um teste técnico. O objetivo é gerenciar uma pequena biblioteca digital, controlando o cadastro de livros, usuários e o fluxo de empréstimos e devoluções.

## ✨ Features

- [cite_start]✅ **Gerenciamento de Livros**: Cadastro [cite: 2][cite_start], listagem (com filtros por status e título)  [cite_start]e atualização de status (`Disponível`/`Emprestado`).
- [cite_start]✅ **Gerenciamento de Usuários**: Cadastro de novos usuários.
- [cite_start]✅ **Sistema de Empréstimos**: Registro de empréstimos  [cite_start]e devoluções.
- [cite_start]✅ **Validação de Dados**: Uso de DTOs com `class-validator` para garantir a integridade dos dados de entrada.
- [cite_start]✅ **Estrutura Modular**: Código organizado em módulos para cada entidade (`books`, `users`, `loans`).
- [cite_start]✅ **Testes Unitários**: Testes com Jest para a lógica de negócio principal, garantindo que regras como "não emprestar um livro já emprestado" sejam respeitadas.

## 🛠️ Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **Testes**: [Jest](https://jestjs.io/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---
