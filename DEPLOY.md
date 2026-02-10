# Como subir o projeto no ar

Este guia explica como colocar o **gerenciamentoKids** (frontend + backend) em produção.

## Visão geral

-   **Backend**: Express (Node) + **Neon (PostgreSQL)**, roda na porta definida por `PORT` (ex.: 3001).
-   **Frontend**: React (Vite), buildado e servido pelo próprio backend na mesma URL.
-   Um único deploy serve site e API no mesmo domínio; o frontend usa `/api` para as requisições.
-   **Banco**: Neon (PostgreSQL serverless). Crie um projeto em [console.neon.tech](https://console.neon.tech) e use a connection string em `DATABASE_URL`.

## 1. Configurar o banco (Neon)

1. Crie uma conta em [console.neon.tech](https://console.neon.tech).
2. Crie um projeto e copie a **connection string** (PostgreSQL).
3. No projeto, crie `backend/.env` com:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

As tabelas são criadas automaticamente na primeira subida do backend.

## 2. Testar em produção localmente

Na raiz do projeto:

```bash
npm run install:all   # se ainda não instalou
npm run build        # gera frontend em backend/public e compila o backend
npm run start        # sobe o backend (que já serve o frontend)
```

Acesse: **http://localhost:3001**. A API está em **http://localhost:3001/api/**.

**Testes**: em `backend`, rode `npm test`. É necessário ter `DATABASE_URL` no `.env`.

---

## 3. Deploy em produção

### Opção A: Railway (recomendado, plano gratuito)

1. Crie uma conta em [railway.app](https://railway.app).
2. **New Project** → **Deploy from GitHub repo** (conecte o repositório) ou use **Empty Project** e suba pelo CLI.
3. Na raiz do repositório, configure:
    - **Root Directory**: deixe em branco (raiz).
    - **Build Command**: `npm run install:all && npm run build`
    - **Start Command**: `npm run start`
    - **Watch Paths**: opcional; pode usar `backend/`, `frontend/`.
4. Variáveis de ambiente (Settings → Variables):
    - `PORT`: Railway define automaticamente; não precisa criar se já existir.
    - `NODE_ENV`: `production`
    - **`DATABASE_URL`**: connection string do Neon (ex.: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`). Obtenha em [console.neon.tech](https://console.neon.tech).
5. Deploy: o Railway faz build e start; a URL do serviço será algo como `https://seu-app.up.railway.app`.

---

### Opção B: Render

1. Crie uma conta em [render.com](https://render.com).
2. **New** → **Web Service**.
3. Conecte o repositório do GitHub.
4. Configuração:
    - **Build Command**: `npm run install:all && npm run build`
    - **Start Command**: `npm run start`
    - **Environment**: Node (versão 18 ou 20).
5. Variáveis:
    - `NODE_ENV`: `production`
    - **`DATABASE_URL`**: connection string do Neon (obtenha em [console.neon.tech](https://console.neon.tech)).
6. **Create Web Service**. A URL será algo como `https://seu-app.onrender.com`.

---

### Opção C: Vercel

O projeto está configurado para rodar no Vercel com **frontend + backend** (API serverless) no mesmo domínio.

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte seu GitHub.
2. **Add New** → **Project** e importe o repositório do `gerenciamentoKids`.
3. O Vercel detecta o `vercel.json`; confira se está assim:
    - **Build Command**: `npm run install:all && npm run build` (ou deixe em branco para usar o do `vercel.json`)
    - **Output Directory**: `backend/public`
4. Variáveis de ambiente (**Settings** → **Environment Variables**):
    - **`DATABASE_URL`**: connection string do Neon (obrigatória). Obtenha em [console.neon.tech](https://console.neon.tech).
    - `NODE_ENV`: `production`
5. Clique em **Deploy**. A URL será algo como `https://gerenciamento-kids.vercel.app`.

**Observação**: A API roda como função serverless. O `vercel.json` define rewrites para `/api/*` e o fallback SPA para o frontend. Arquivos estáticos têm prioridade sobre os rewrites.

---

### Opção D: VPS ou servidor próprio

No servidor (Linux):

```bash
git clone <seu-repositorio>
cd gerenciamentoKids
npm run install:all
npm run build
```

Variáveis de ambiente (ex.: em `.env` no `backend/` ou no systemd):

-   `PORT=3001` (ou a porta que quiser).
-   **`DATABASE_URL`**: connection string do Neon (PostgreSQL).

Inicie o backend:

```bash
npm run start
```

Use um **process manager** (ex.: PM2) e um **proxy reverso** (Nginx/Caddy) com HTTPS:

-   Nginx: proxy para `http://127.0.0.1:3001`.
-   Caddy: `reverse_proxy localhost:3001`.

---

## 4. Variáveis de ambiente

| Variável           | Uso                                                                                |
| ------------------ | ---------------------------------------------------------------------------------- |
| `PORT`             | Porta do servidor (muitos provedores definem automaticamente).                     |
| **`DATABASE_URL`** | Connection string do Neon (PostgreSQL). Obrigatória. Obtenha em console.neon.tech. |
| `NODE_ENV`         | `production` em produção.                                                          |

---

## 5. Scripts úteis (raiz do projeto)

| Comando                | Descrição                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm run install:all`  | Instala dependências do root, backend e frontend.                                  |
| `npm run build`        | Build do frontend + build do backend (saída em `backend/public` e `backend/dist`). |
| `npm run start`        | Sobe o backend (e serve o frontend se `backend/public` existir).                   |
| `npm run dev:backend`  | Backend em modo desenvolvimento.                                                   |
| `npm run dev:frontend` | Frontend em modo desenvolvimento (proxy para API em localhost:3001).               |

---

## 6. Resumo rápido

**Railway**: Repo no GitHub → New Project → Build `npm run install:all && npm run build` → Start `npm run start` → `DATABASE_URL` → Deploy.

**Vercel**: Repo no GitHub → Add Project → variável `DATABASE_URL` → Deploy (usa `vercel.json`).

1. Repo no GitHub.
2. Railway → New Project → Deploy from GitHub.
3. Build: `npm run install:all && npm run build`
4. Start: `npm run start`
5. Defina a variável **`DATABASE_URL`** com a connection string do Neon.
6. Deploy; usar a URL fornecida pelo Railway.

Depois disso, o projeto estará no ar com frontend e API no mesmo domínio.
