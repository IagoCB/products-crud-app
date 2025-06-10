# 🛍️ Products CRUD App

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC"/>
</div>

Este é um aplicativo de gerenciamento de produtos desenvolvido com Next.js, TypeScript e Turborepo. O projeto permite realizar operações CRUD (Create, Read, Update, Delete) em produtos, oferecendo uma interface moderna e responsiva.

## ✨ Funcionalidades

- 📋 Listagem de produtos
- ➕ Criação de novos produtos
- ✏️ Edição de produtos existentes
- 🗑️ Exclusão de produtos
- 📱 Interface responsiva e moderna
- ✅ Validação de dados
- 💬 Feedback visual para ações do usuário
- 🔄 Atualizações em tempo real com WebSocket

## 🛠️ Tecnologias Utilizadas

- **Frontend:**

  - Next.js
  - TypeScript
  - React
  - Tailwind CSS
  - tRPC
  - WebSocket

- **Backend:**

  - Node.js
  - tRPC
  - WebSocket

- **DevOps:**

  - Docker
  - Docker Compose
  - Turborepo

- **Ferramentas de Desenvolvimento:**
  - ESLint
  - Prettier
  - Git

## 📁 Estrutura do Projeto

O projeto está organizado em um monorepo usando Turborepo, contendo:

- `web`: Aplicação principal Next.js
- `@repo/ui`: Biblioteca de componentes React compartilhada
- `@repo/eslint-config`: Configurações do ESLint
- `@repo/typescript-config`: Configurações do TypeScript

## 🚀 Executando o Projeto

### Com Docker

1. Certifique-se de ter o Docker instalado em sua máquina
2. Clone o repositório:

```bash
# HTTPS
git clone https://github.com/IagoCB/products-crud-app.git

# SSH
git clone git@github.com:IagoCB/products-crud-app.git

cd products-crud-app
```

3. Execute o projeto com Docker Compose:

```bash
docker-compose up
```

O aplicativo estará disponível em `http://localhost:3000`

### Sem Docker

1. Certifique-se de ter o Node.js (versão 18 ou superior) instalado
2. Clone o repositório:

```bash
# HTTPS
git clone https://github.com/IagoCB/products-crud-app.git

# SSH
git clone git@github.com:IagoCB/products-crud-app.git

cd products-crud-app
```

3. Instale as dependências:

```bash
yarn install
```

4. Execute o projeto em modo de desenvolvimento:

```bash
yarn dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento
- `yarn build`: Compila o projeto para produção
- `yarn start`: Inicia o servidor de produção
- `yarn lint`: Executa a verificação de linting
- `yarn format`: Formata o código usando Prettier
