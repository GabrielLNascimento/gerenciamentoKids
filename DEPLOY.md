# Como subir o projeto no ar

Este guia explica como colocar o **gerenciamentoKids** (frontend + backend) em produção.

## Visão geral

-   **Backend**: Express (Node) + SQLite, roda na porta definida por `PORT` (ex.: 3001).
-   **Frontend**: React (Vite), buildado e servido pelo próprio backend na mesma URL.
-   Um único deploy serve site e API no mesmo domínio; o frontend usa `/api` para as requisições.

## 1. Testar em produção localmente

Na raiz do projeto:

```bash
npm run install:all   # se ainda não instalou
npm run build        # gera frontend em backend/public e compila o backend
npm run start        # sobe o backend (que já serve o frontend)
```

Acesse: **http://localhost:3001**. A API está em **http://localhost:3001/api/**.

---

## 2. Deploy em produção

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
    - (Opcional) `DB_PATH`: ex. `/data/database.sqlite` se usar volume (veja abaixo).
5. Para **persistir o SQLite** no Railway:
    - No projeto, **Add Service** → **Volume**.
    - Monte o volume em um path, ex.: `/data`.
    - Defina `DB_PATH=/data/database.sqlite`.
6. Deploy: o Railway faz build e start; a URL do serviço será algo como `https://seu-app.up.railway.app`.

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
    - (Opcional) `DB_PATH`: para disco persistente, use path do disco do Render se disponível.
6. **Create Web Service**. A URL será algo como `https://seu-app.onrender.com`.

**Nota**: No plano gratuito do Render, o disco pode ser efêmero; o SQLite pode ser resetado após inatividade. Para dados permanentes, use volume (se disponível) ou migre para um banco hospedado depois.

---

### Opção C: VPS ou servidor próprio

No servidor (Linux):

```bash
git clone <seu-repositorio>
cd gerenciamentoKids
npm run install:all
npm run build
```

Variáveis de ambiente (ex.: em `.env` no `backend/` ou no systemd):

-   `PORT=3001` (ou a porta que quiser).
-   `DB_PATH=/var/data/gerenciamentoKids/database.sqlite` (path persistente).

Inicie o backend:

```bash
npm run start
```

Use um **process manager** (ex.: PM2) e um **proxy reverso** (Nginx/Caddy) com HTTPS:

-   Nginx: proxy para `http://127.0.0.1:3001`.
-   Caddy: `reverse_proxy localhost:3001`.

---

## 3. Variáveis de ambiente

| Variável   | Uso                                                                         |
| ---------- | --------------------------------------------------------------------------- |
| `PORT`     | Porta do servidor (muitos provedores definem automaticamente).              |
| `DB_PATH`  | Caminho do arquivo SQLite (ex.: `/data/database.sqlite` para persistência). |
| `NODE_ENV` | `production` em produção.                                                   |

---

## 4. Scripts úteis (raiz do projeto)

| Comando                | Descrição                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm run install:all`  | Instala dependências do root, backend e frontend.                                  |
| `npm run build`        | Build do frontend + build do backend (saída em `backend/public` e `backend/dist`). |
| `npm run start`        | Sobe o backend (e serve o frontend se `backend/public` existir).                   |
| `npm run dev:backend`  | Backend em modo desenvolvimento.                                                   |
| `npm run dev:frontend` | Frontend em modo desenvolvimento (proxy para API em localhost:3001).               |

---

## 5. Resumo rápido (Railway)

1. Repo no GitHub.
2. Railway → New Project → Deploy from GitHub.
3. Build: `npm run install:all && npm run build`
4. Start: `npm run start`
5. (Opcional) Volume para `DB_PATH` e variável `DB_PATH=/data/database.sqlite`.
6. Deploy; usar a URL fornecida pelo Railway.

Depois disso, o projeto estará no ar com frontend e API no mesmo domínio.
