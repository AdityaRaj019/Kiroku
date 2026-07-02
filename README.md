# ⚡ Kiroku

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-v4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/PRISMA-Database-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

</div>

> A high-performance, centralized manga release tracking and multi-channel notification platform. Designed to eliminate update friction, consolidate reading progress, and deliver notifications within minutes of source releases.

---

## 🌟 The Vision

**Kiroku** is one of the coolest and most robust manga tracking systems built on a decoupled, asynchronous, worker-driven architecture. 

Rather than manually cycling through aggregator sites or checking bookmarks, readers register their favorite series, configure granular notification channels (Web Push, Email, and In-App feeds), and get alerts the instant a new chapter drops. The platform is designed from the ground up for high throughput, strict API rate-limit compliance, and maximum type safety.

## 📊 System Stats (RPG Character Sheet)

```text
=======================================================
|                 KIROKU CORE ENGINE STATUS           |
=======================================================
|  [SPEED]      S-RANK  (Chapter sync delay < 5m)     |
|  [UPTIME]     S-RANK  (Target SLA: 99.95%)          |
|  [RESILIENCE] A-RANK  (Offline connection fallback) |
|  [CACHING]    S-RANK  (Redis hit latency < 15ms)    |
|  [SECURITY]   A-RANK  (SHA-256 pre-hashed bcrypt)   |
|  [DELIVERY]   99.9%   (FCM Push + Resend Email)     |
=======================================================
```

---

## 🛠️ The Tech Stack

Kiroku is split into a modular backend service, a background queue worker system, and a modern frontend interface:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Core** | Express, TypeScript, Node.js | Fast, type-safe REST API server |
| **Database & ORM**| PostgreSQL, Prisma (v7+) | Relational storage with strict foreign keys & transaction safety |
| **Caching & Queues**| Redis, BullMQ | Token-bucket rate-limiting, chapter syncer, and notification queues |
| **Authentication** | `jose` (JWT), `bcryptjs`, SHA-256 | Hardened JWT token rotation + SHA-256 password pre-hashing |
| **Real-Time Feed** | Socket.IO | Active client handshake authentication and instant alert broadcasting |
| **Validation** | Zod | Boundary type-guards for request bodies, query params, and environments |
| **Frontend UI** | Next.js (App Router), Zustand, Tailwind CSS | Cyberpunk/RPG-inspired design with lo-fi soundscapes |

---

## 🚀 Key Features

* **Instant release syncing**: Scheduled cron workers scan external sources (like MangaDex) and queue notifications within **5 minutes** of target releases.
* **Granular User Libraries**: Unified `LibraryItem` structure supporting status tracking (`READING`, `COMPLETED`, `PLAN_TO_READ`, `DROPPED`, `PAUSED`), progress counters, custom ratings (1–10), and start/end dates.
* **Privacy-Aware Public Profiles**: Public library endpoints that automatically filter out sensitive private user settings (such as notification preferences).
* **Hardened Security**:
  * Password security that prevents bcrypt's 72-byte truncation limits by pre-hashing with SHA-256 first.
  * Rigid HTTP rate limiters (60 req/min global, 5 req/min auth, 30 req/min searches).
  * CORS origin checks supporting comma-separated whitelist patterns.
* **Aggregated Feeds & Preferences**: Option to exclude certain scanlation groups, set language constraints, and establish global "Quiet Hours" to block push alerts.

---

## 📁 Repository Structure

```text
kiroku/
├── backend/                  # Express REST API Server & Database configuration
│   ├── prisma/               # Prisma migrations, schema, and database seeds
│   ├── src/
│   │   ├── middlewares/      # Express middlewares (auth, validation, errors)
│   │   ├── modules/          # Feature-grouped directories
│   │   │   ├── auth/         # JWT credentials, login/register logic
│   │   │   ├── library/      # User library upsert, query, and deletion
│   │   │   └── manga/        # MangaDex API wrappers and local caches
│   │   ├── services/         # Third-party integrations (MangaDex service)
│   │   ├── utils/            # Shared cryptographic, database, and JWT helpers
│   │   └── index.ts          # Server entrypoint and Socket.IO handshake setup
│   └── tsconfig.json
│
├── frontend/                 # Next.js 16 Client App (Tailwind CSS, Zustand, TanStack Query)
└── plan/                     # Step-by-step backend and frontend roadmap plans
```

---

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (v20+ recommended)
* PostgreSQL
* Redis (running locally or via Docker)

### 1. Database & Cache Infrastructure
Ensure that Redis is running. If you are using Docker, you can start the configured local Redis container:
```bash
docker start kiroku-redis
```

### 2. Backend Setup
Navigate into the `backend/` folder and install dependencies:
```bash
cd backend
npm install
```

Configure your environment variables by creating `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kiroku?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secure-jwt-secret-key"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

Deploy the database migrations and seed the database with mock records:
```bash
# Run database migrations
npx prisma migrate deploy

# Generate the client types
npx prisma generate

# Populate development seed records (Alice, Bob, Carol, and 5 manga titles)
npx prisma db seed
```

Start the development server with automatic nodemon reload:
```bash
npm run dev:backend
```
The server will boot up and listen for requests on port `5000`.

### 3. Frontend Setup
Navigate into the `frontend/` folder, install dependencies, and start the Next.js development server:
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Routing Overview

All endpoints are versioned and mounted under `/api/v1`.

### Authentication (`/api/v1/auth`)
* `POST /register` — Register a new account.
* `POST /login` — Authenticate and retrieve standard JWT Bearer access token. Sets HttpOnly cookie for refresh tokens.
* `POST /logout` — Clear auth cookies and revoke current refresh token session.

### Manga Discovery (`/api/v1/manga`)
* `GET /` — Rate-limited, Redis-cached global search.
* `GET /:id` — Detailed metadata for a single manga series, enriched with follow states if request header contains auth tokens.
* `GET /:id/chapters` — Paginated list of chapters fetched from local cache/source.

### User Library (`/api/v1/library`)
* `POST /` — Add or update a library item (auto-manages start/end dates based on status, validates input bounds, supports both manga and anime).
* `GET /` — Paginated owner list (private, includes notification preferences).
* `GET /users/:userId` — Paginated public list for a specific user (strips private preferences).
* `DELETE /:itemId` — Securely deletes a library item after ownership verification.
