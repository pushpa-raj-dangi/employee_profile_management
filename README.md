# 🚀 Full Stack TypeScript App (GraphQL + React)

This is a full-stack TypeScript application built with:

- **Backend:** Node.js, Express 5, TypeGraphQL, Prisma ORM, Redis, PostgreSQL
- **Frontend:** React 19, Vite, Apollo Client, MUI (Material UI)

---

## 📁 Project Structure

```
root/
├── api/ # Backend (GraphQL API)
│ ├── prisma/ # Prisma schema and seed
│ ├── src/ # TypeScript source code
│ └── package.json
├── client/ # Frontend (React + Vite)
│ ├── src/ # React components & pages
│ └── package.json
└── README.md
```


---

## 🛠 Prerequisites

- **Node.js** (v18 or later)
- **PostgreSQL** (for backend DB)
- **Redis** (for session store)
- **pnpm / npm / yarn**

---

## ⚙️ Backend Setup

1. Navigate to the `api` directory:

```bash
cd api

npm install
# or npm install

```
2. Run as dev:

```bash
npm run dev 
```


## 💻 Frontend Setup

1. Navigate to the `client` directory:

```bash
cd client

npm install
# or npm install

```
2. Run as dev:

```bash
npm run dev 
```

* Frontend `http://localhost:4200`
* Backend `http://localhost:4000`