# 🚀 Full Stack TypeScript App (GraphQL + React)

This is a full-stack TypeScript application built with:

- **Backend:** Node.js, Express 5, TypeGraphQL, Prisma ORM, Redis, PostgreSQL
- **Frontend:** React 19, Vite, Apollo Client, MUI (Material UI)

---

## 🚀 Live Demo
[Click here to view the app](https://jolly-tree-043a69c00.2.azurestaticapps.net)


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
- **npm **

---

## 📥 Getting Started

```bash
git clone https://github.com/pushpa-raj-dangi/employee_profile_management.git
cd employee_profile_management
```

## ⚙️ Backend Setup

1. Navigate to the `api` directory:

```bash
cd api

npm install
# or npm install

```
2. Seed Sample Data:
```bash
ts-node prisma/seed.ts

```
3. Run as dev:

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

## 🛠️ How to Run Locally

### Prerequisites
- Node.js
- PostgreSQL/MySQL
- Yarn / npm
- `.env` file setup (see below)

### Environment Variables
```env


DATABASE_URL="postgresql://postgres:your_password@localhost:5432/employee_management"

ALLOWED_ORIGINS=your-frontend-url.com,http://localhost:4200

JWT_SECRET="your_jwt_secret_key"
SESSION_SECRET="your_session_secret_key"


REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password

# Email (for password reset / notifications)
EMAIL_FROM="your_email@example.com"
EMAIL_HOST=you_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_username
EMAIL_PASSWORD=your_email_password

FRONTEND_URL="http://localhost:4200"
COOKIE_DOMAIN="localhost"

...

## Environment sample file
```
1. env.sample