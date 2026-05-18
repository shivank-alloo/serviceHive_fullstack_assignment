# Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the MERN stack and TypeScript.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 · TypeScript · TailwindCSS · Vite |
| Backend | Node.js · Express · TypeScript |
| Database | MongoDB · Mongoose |
| Auth | JWT (httpOnly cookies) · bcrypt |
| DevOps | Docker · docker-compose |

## Features

- ✅ JWT Authentication (register, login, logout, protected routes)
- ✅ Lead CRUD (create, read, update, delete)
- ✅ Role-Based Access Control (Admin / Sales User)
- ✅ Advanced Filtering — status + source + search (all work together)
- ✅ Debounced Search (300ms)
- ✅ Backend Pagination (skip/limit, 10 per page)
- ✅ CSV Export (all filtered records)
- ✅ Dark Mode (OS preference + manual toggle, persisted)
- ✅ Responsive Design

## RBAC Summary

| Action | Admin | Sales User |
|---|---|---|
| View leads | All leads | Own leads only |
| Create lead | ✅ | ✅ |
| Update lead | ✅ (any) | ✅ (own only) |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own leads) |

## Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- MongoDB running locally on port 27017

### Backend

```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

## Docker Setup

```bash
cp .env.example .env
# Edit JWT_SECRET in .env

docker-compose up --build
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
# MongoDB:  mongodb://localhost:27017
```

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | CORS allowed origin | `http://localhost:5173` |
| `BCRYPT_SALT_ROUNDS` | bcrypt rounds | `12` |

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register user |
| `POST` | `/auth/login` | Public | Login → sets cookie |
| `POST` | `/auth/logout` | Required | Clear cookie |
| `GET` | `/auth/me` | Required | Get current user |

### Lead Routes

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/leads` | Any | List leads (filtered + paginated) |
| `POST` | `/leads` | Any | Create lead |
| `GET` | `/leads/export` | Any | Export filtered leads as CSV |
| `GET` | `/leads/:id` | Any | Get single lead |
| `PATCH` | `/leads/:id` | Any | Update lead |
| `DELETE` | `/leads/:id` | Admin | Delete lead |

### Query Parameters for `GET /leads`

| Param | Type | Description |
|---|---|---|
| `status` | `new\|contacted\|qualified\|lost` | Filter by status |
| `source` | `website\|instagram\|referral` | Filter by source |
| `search` | `string` | Search by name or email |
| `sort` | `latest\|oldest` | Sort order |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (default: 10) |

### Pagination Response Shape

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "pagination": {
    "total": 120,
    "page": 3,
    "limit": 10,
    "totalPages": 12,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Project Structure

```
serviceHive_fullstack_assignment/
├── client/                   # React + TypeScript + TailwindCSS (Vite)
│   └── src/
│       ├── api/              # Axios instances + typed API calls
│       ├── components/       # Reusable UI (ui/, leads/, layout/)
│       ├── context/          # AuthContext, ThemeContext
│       ├── hooks/            # useDebounce, useLeads, useAuth
│       ├── pages/            # Login, Register, Dashboard, LeadDetail
│       ├── types/            # Shared TypeScript interfaces
│       └── utils/            # csvExport, formatDate
│
├── server/                   # Express + TypeScript API
│   └── src/
│       ├── config/           # db.ts, env.ts
│       ├── controllers/      # Thin HTTP handlers
│       ├── middleware/        # auth, role, error, validate
│       ├── models/           # User.model, Lead.model
│       ├── routes/           # auth.routes, lead.routes
│       ├── services/         # Business logic layer
│       ├── types/            # Shared interfaces
│       └── utils/            # ApiError, ApiResponse, asyncHandler, jwt
│
├── docker-compose.yml
├── .env.example
└── README.md
```
