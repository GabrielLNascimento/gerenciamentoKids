# Gerenciador Kids

Sistema completo de gerenciamento de crianças e cultos, desenvolvido com Node.js/Express no backend e React no frontend.

## 🚀 Tecnologias

### Backend

-   Node.js + Express
-   TypeScript
-   SQLite
-   Jest (testes)

### Frontend

-   React + TypeScript
-   React Router
-   Tailwind CSS
-   Vite
-   Axios

## 📋 Funcionalidades

### Banco de Dados

-   ✅ Tabela de crianças (nome, idade, responsável, telefone)
-   ✅ Tabela de cultos (nome, período, data, userId)
-   ✅ Tabela de presença (relação entre crianças e cultos)

### Backend - APIs

-   ✅ CRUD completo para crianças
-   ✅ CRUD completo para cultos
-   ✅ Gerenciamento de presença (adicionar/remover criança do culto)
-   ✅ Busca de crianças por nome
-   ✅ API de estatísticas

### Frontend

-   ✅ Dashboard com estatísticas
-   ✅ Página de gerenciamento de crianças (CRUD)
-   ✅ Página de criação/edição de cultos
-   ✅ Página de listagem de cultos
-   ✅ Página de detalhes do culto com lista de crianças
-   ✅ Componente de busca/seleção de crianças

### Testes

-   ✅ Testes unitários para APIs de crianças
-   ✅ Testes unitários para APIs de cultos
-   ✅ Testes unitários para APIs de estatísticas

## 🛠️ Instalação

1. Instale as dependências de todos os projetos:

```bash
npm run install:all
```

2. Configure as variáveis de ambiente do backend:

```bash
cd backend
cp .env.example .env
```

3. Inicie o backend:

```bash
npm run dev:backend
```

4. Em outro terminal, inicie o frontend:

```bash
npm run dev:frontend
```

5. Acesse o sistema em: http://localhost:3000

## 📝 Scripts Disponíveis

### Raiz do projeto

-   `npm run install:all` - Instala dependências de todos os projetos
-   `npm run dev:backend` - Inicia o backend em modo desenvolvimento
-   `npm run dev:frontend` - Inicia o frontend em modo desenvolvimento
-   `npm run build:backend` - Compila o backend
-   `npm run build:frontend` - Compila o frontend
-   `npm run test:backend` - Executa os testes do backend

### Backend

-   `npm run dev` - Inicia em modo desenvolvimento com hot reload
-   `npm run build` - Compila TypeScript
-   `npm start` - Inicia o servidor compilado
-   `npm test` - Executa os testes

### Frontend

-   `npm run dev` - Inicia o servidor de desenvolvimento
-   `npm run build` - Compila para produção
-   `npm run preview` - Preview da build de produção

## 🗄️ Estrutura do Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução do backend.

### Tabela: criancas

-   id (INTEGER PRIMARY KEY)
-   nome (TEXT)
-   idade (INTEGER)
-   responsavel (TEXT)
-   telefone (TEXT)
-   createdAt (DATETIME)
-   updatedAt (DATETIME)

### Tabela: cultos

-   id (INTEGER PRIMARY KEY)
-   nome (TEXT)
-   periodo (TEXT)
-   data (TEXT)
-   userId (TEXT)
-   createdAt (DATETIME)
-   updatedAt (DATETIME)

### Tabela: presenca

-   id (INTEGER PRIMARY KEY)
-   criancaId (INTEGER)
-   cultoId (INTEGER)
-   createdAt (DATETIME)

## 🎨 Styling

O projeto utiliza Tailwind CSS com um tema personalizado:

-   Cores primárias em tons de azul
-   Animações sutis (fade-in, slide-up)
-   Layout totalmente responsivo
-   Componentes reutilizáveis com classes utilitárias

## 📚 API Endpoints

### Crianças

-   `GET /api/criancas` - Lista todas as crianças
-   `GET /api/criancas/buscar?nome=...` - Busca crianças por nome
-   `GET /api/criancas/:id` - Obtém uma criança específica
-   `POST /api/criancas` - Cria uma nova criança
-   `PUT /api/criancas/:id` - Atualiza uma criança
-   `DELETE /api/criancas/:id` - Deleta uma criança

### Cultos

-   `GET /api/cultos` - Lista todos os cultos
-   `GET /api/cultos/:id` - Obtém um culto específico
-   `POST /api/cultos` - Cria um novo culto
-   `PUT /api/cultos/:id` - Atualiza um culto
-   `DELETE /api/cultos/:id` - Deleta um culto
-   `GET /api/cultos/:id/criancas` - Lista crianças de um culto
-   `POST /api/cultos/:id/criancas` - Adiciona criança a um culto
-   `DELETE /api/cultos/:cultoId/criancas/:criancaId` - Remove criança de um culto

### Estatísticas

-   `GET /api/estatisticas` - Obtém estatísticas gerais

## 🧪 Testes

Os testes estão localizados em `backend/src/__tests__/` e podem ser executados com:

```bash
cd backend
npm test
```

## 📄 Licença

ISC
