# Smart Leads Dashboard

<div align="center">

![Smart Leads Dashboard](https://img.shields.io/badge/Smart_Leads-Dashboard-6366f1?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A production-grade Lead Management Dashboard built with the MERN stack + TypeScript.**  
JWT authentication · Role-Based Access Control · Advanced filtering · CSV Export · Dark Mode

[Live Demo](#) · [API Docs](#api-documentation) · [Setup Guide](#local-development)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Role-Based Access Control](#role-based-access-control)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment Guide](#deployment-guide)
- [Design Decisions](#design-decisions)

---

## Overview

Smart Leads Dashboard is a full-stack application that allows sales teams to create, manage, and track leads through their sales pipeline. Admins have full visibility over all leads, while Sales Users can only access the leads they created — enforced at both the API and UI layers.

---

## Features

| Feature | Details |
|---|---|
| **JWT Authentication** | httpOnly cookies + Bearer token support; session restored on page reload |
| **Role-Based Access Control** | Admin sees all leads; Sales sees own leads only — enforced in service layer |
| **Lead CRUD** | Create, read, update, delete with full validation |
| **Advanced Filtering** | Filter by status + source + search — all compose simultaneously |
| **Debounced Search** | 300ms debounce prevents request flooding on keypress |
| **Backend Pagination** | `skip`/`limit` with full pagination metadata in every response |
| **CSV Export** | Exports all filtered records (ignores pagination limit) |
| **Dark Mode** | OS preference default + manual toggle, persisted in localStorage |
| **Responsive Design** | Mobile-first layout, collapsible sidebar on small screens |
| **Loading & Empty States** | Skeleton rows, empty state illustration, error banners |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + TypeScript | Component framework with strict types |
| TailwindCSS 3 | Utility-first styling with dark mode class strategy |
| Vite 5 | Build tool with HMR and code splitting |
| React Query v5 | Server state, caching, and cache invalidation |
| React Hook Form + Zod | Type-safe form handling and schema validation |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |
| react-hot-toast | Notification system |

### Backend
| Tool | Purpose |
|---|---|
| Express.js + TypeScript | RESTful API framework |
| MongoDB + Mongoose | Document database with typed schemas |
| bcryptjs | Password hashing (configurable rounds) |
| jsonwebtoken | JWT sign/verify with typed payload |
| express-validator | Request validation middleware chains |
| helmet + cors | Security headers and CORS configuration |
| cookie-parser | httpOnly cookie support |
| morgan | HTTP request logging |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│   Pages → Components → Hooks → API Layer → Axios Instance   │
└─────────────────────────┬───────────────────────────────────┘
                           │ /api/* (proxy in dev / nginx in prod)
┌─────────────────────────▼───────────────────────────────────┐
│                    Express API Server                         │
│  Routes → Middleware (auth/role/validate) → Controllers      │
│                          ↓                                   │
│                       Services                               │
│                (Business logic + RBAC)                       │
│                          ↓                                   │
│                  Mongoose Models                             │
└─────────────────────────┬───────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────┐
│                   MongoDB Database                           │
│     Collections: users, leads                               │
│     Indexes: createdBy+createdAt, status, source, text       │
└─────────────────────────────────────────────────────────────┘
```

---

## Role-Based Access Control

| Action | Admin | Sales User |
|---|---|---|
| View leads | ✅ All leads | ✅ Own leads only |
| Create lead | ✅ | ✅ |
| Update lead | ✅ Any lead | ✅ Own leads only |
| Delete lead | ✅ | ❌ (403 Forbidden) |
| Export CSV | ✅ All leads | ✅ Own leads only |

RBAC is enforced in **two places**:
1. **API layer** — `requireRole('admin')` middleware on delete routes
2. **Service layer** — `getLeads()`, `getLeadById()`, `updateLead()` filter by `createdBy` for sales role

---

## Project Structure

```
serviceHive_fullstack_assignment/
│
├── client/                         # React + TypeScript frontend
│   ├── src/
│   │   ├── api/                    # Axios instance + typed API modules
│   │   │   ├── axios.ts            # Base Axios config (credentials, interceptors)
│   │   │   ├── auth.api.ts         # Auth endpoints
│   │   │   └── lead.api.ts         # Lead CRUD + export endpoints
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable design system components
│   │   │   │   ├── Button.tsx      # 5 variants, loading state, icon slots
│   │   │   │   ├── Input.tsx       # Label, error, left/right element slots
│   │   │   │   ├── Select.tsx      # Custom styled select with option array
│   │   │   │   ├── Modal.tsx       # Accessible: Escape, click-outside, scroll-lock
│   │   │   │   └── Spinner.tsx     # Spinner + FullPageSpinner
│   │   │   │
│   │   │   ├── leads/              # Lead domain components
│   │   │   │   ├── LeadTable.tsx   # Table with skeleton, empty state, pagination
│   │   │   │   ├── LeadForm.tsx    # Shared create/edit form with Zod validation
│   │   │   │   ├── LeadFilters.tsx # Collapsible filter bar with debounced search
│   │   │   │   └── LeadStatusBadge.tsx # Status dot + label badges
│   │   │   │
│   │   │   └── layout/             # Shell components
│   │   │       ├── Sidebar.tsx     # NavLinks with active state + user info
│   │   │       ├── Navbar.tsx      # Dark mode toggle + user avatar
│   │   │       └── DashboardLayout.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Session restore on mount, login/logout
│   │   │   └── ThemeContext.tsx    # OS preference + localStorage persistence
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts      # Generic debounce with cleanup
│   │   │   └── useLeads.ts         # React Query hooks for all lead operations
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.tsx           # Split-panel design with brand stats
│   │   │   ├── Register.tsx        # Role selection with admin warning
│   │   │   ├── Dashboard.tsx       # Main leads page with all features
│   │   │   ├── LeadDetail.tsx      # Single lead with edit/delete
│   │   │   └── NotFound.tsx        # 404 page
│   │   │
│   │   ├── types/                  # All TypeScript interfaces
│   │   │   ├── lead.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── api.types.ts        # Generic ApiResponse<T> + PaginationMeta
│   │   │   └── filter.types.ts
│   │   │
│   │   └── utils/
│   │       ├── csvExport.ts        # Blob URL download with memory cleanup
│   │       └── formatDate.ts       # Intl.DateTimeFormat + relative time
│   │
│   ├── Dockerfile                  # Multi-stage: vite build → nginx:alpine
│   ├── nginx.conf                  # SPA fallback + asset caching
│   └── vite.config.ts              # Path alias + /api proxy
│
├── server/                         # Express + TypeScript API
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              # Typed loader — throws on missing vars
│   │   │   └── db.ts               # Mongoose connect with lifecycle logging
│   │   │
│   │   ├── types/
│   │   │   ├── express.d.ts        # Augments req.user: IUserDocument
│   │   │   ├── user.types.ts       # IUser, IUserDocument, payloads, JwtPayload
│   │   │   └── lead.types.ts       # ILead, ILeadDocument, filters, payloads
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.ts         # Structured error class with factory methods
│   │   │   ├── ApiResponse.ts      # Generic wrapper + paginated() factory
│   │   │   ├── asyncHandler.ts     # Async error forwarding to Express
│   │   │   └── jwt.ts              # signToken / verifyToken + cookie options
│   │   │
│   │   ├── models/
│   │   │   ├── User.model.ts       # bcrypt pre-save hook, comparePassword()
│   │   │   └── Lead.model.ts       # Compound indexes, text search index
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts  # Cookie + Bearer token authentication
│   │   │   ├── role.middleware.ts  # requireRole(...roles) factory
│   │   │   ├── validate.middleware.ts # express-validator result handler
│   │   │   └── error.middleware.ts # Centralized error + notFound handler
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts     # Register, login, getMe — business logic
│   │   │   └── lead.service.ts     # CRUD + RBAC scoping + export
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts  # HTTP layer: cookies, status codes
│   │   │   └── lead.controller.ts  # HTTP layer: CSV streaming, query parsing
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # POST /register, /login, /logout, GET /me
│   │   │   └── lead.routes.ts      # Full CRUD + GET /export
│   │   │
│   │   ├── app.ts                  # Express app: middleware + routes
│   │   └── server.ts               # DB connect → listen → graceful shutdown
│   │
│   ├── Dockerfile                  # Multi-stage: tsc build → node:alpine
│   └── .env.example
│
├── docker-compose.yml              # mongo + server + client services
├── .env.example
└── README.md
```

---

## Local Development

### Prerequisites

- **Node.js** 20+
- **MongoDB** running locally on port 27017
- **npm** 9+

### 1. Clone the repository

```bash
git clone https://github.com/shivank-alloo/serviceHive_fullstack_assignment.git
cd serviceHive_fullstack_assignment
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env — at minimum set MONGO_URI and JWT_SECRET
npm install
npm run dev
# ✅ API running at http://localhost:5001
# ✅ Health check: http://localhost:5001/health
```

### 3. Frontend setup

```bash
# In a new terminal tab
cd client
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

### 4. Open in browser

Navigate to **http://localhost:5173** and register a new account.

> **Tip:** Register with role `Admin` to access all features including lead deletion.

---

## Docker Setup

Runs all three services (MongoDB, API, Client) with a single command.

### Prerequisites

- Docker Desktop installed and running

### Steps

```bash
# 1. Copy root env file and set JWT_SECRET
cp .env.example .env
# Edit .env: JWT_SECRET=your-very-long-random-secret-here

# 2. Build and start all services
docker-compose up --build

# Services:
# Frontend → http://localhost:80
# API      → http://localhost:5001
# MongoDB  → mongodb://localhost:27017
```

### Stop services

```bash
docker-compose down          # Stop containers
docker-compose down -v       # Stop containers AND delete MongoDB data
```

---

## API Documentation

**Base URL:** `http://localhost:5001/api`  
**Authentication:** httpOnly cookie (set automatically on login) or `Authorization: Bearer <token>`

### Response Format

All responses follow this consistent shape:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

Paginated responses include:

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [ ],
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

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Email is required", "Password must be at least 8 characters"]
}
```

---

### Auth Routes

#### `POST /api/auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Rahul@123",
  "role": "sales"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | ✅ | 2–100 characters |
| `email` | string | ✅ | Valid email format |
| `password` | string | ✅ | Min 8 chars, must have uppercase + lowercase + digit |
| `role` | `admin` \| `sales` | ❌ | Defaults to `sales` |

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales" },
    "token": "eyJ..."
  }
}
```

---

#### `POST /api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "Rahul@123"
}
```

**Response `200`:** Sets `token` httpOnly cookie + returns same shape as register.

---

#### `POST /api/auth/logout`

Clears the auth cookie. Requires authentication.

**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

#### `GET /api/auth/me`

Returns the currently authenticated user. Requires authentication.

**Response `200`:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales", "createdAt": "..." }
}
```

---

### Lead Routes

All lead routes require authentication.

#### `GET /api/leads`

List leads with optional filtering, search, sorting, and pagination.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | `new` \| `contacted` \| `qualified` \| `lost` | Filter by lead status |
| `source` | `website` \| `instagram` \| `referral` | Filter by lead source |
| `search` | string | Search by name or email (case-insensitive regex) |
| `sort` | `latest` \| `oldest` | Sort by `createdAt` (default: `latest`) |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page, max 100 (default: `10`) |

**Example:** `GET /api/leads?status=qualified&source=instagram&search=Rahul&sort=latest&page=1&limit=10`

**Response `200`:** Paginated lead array (see Response Format above).

> **RBAC:** Sales users only receive leads where `createdBy === req.user._id`.

---

#### `POST /api/leads`

Create a new lead.

**Request Body:**
```json
{
  "name": "Priya Singh",
  "email": "priya@example.com",
  "status": "new",
  "source": "instagram"
}
```

| Field | Type | Required | Values |
|---|---|---|---|
| `name` | string | ✅ | 2–150 characters |
| `email` | string | ✅ | Valid email |
| `status` | string | ✅ | `new` \| `contacted` \| `qualified` \| `lost` |
| `source` | string | ✅ | `website` \| `instagram` \| `referral` |

**Response `201`:** Created lead object.

---

#### `GET /api/leads/export`

Export filtered leads as a CSV file. Accepts the same query params as `GET /api/leads` **except** `page` and `limit` (returns all matching records).

**Response `200`:**
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="leads-export-2026-05-18.csv"`

**CSV columns:** `ID, Name, Email, Status, Source, Created At`

---

#### `GET /api/leads/:id`

Get a single lead by ID.

**Response `200`:** Lead object with populated `createdBy` (name, email, role).

> **RBAC:** Sales users receive `403` if the lead was created by another user.

---

#### `PATCH /api/leads/:id`

Update a lead. All fields are optional.

**Request Body:**
```json
{
  "status": "qualified",
  "source": "referral"
}
```

**Response `200`:** Updated lead object.

> **RBAC:** Sales users receive `403` if they didn't create the lead.

---

#### `DELETE /api/leads/:id`

Delete a lead permanently.

**Response `200`:** `{ "success": true, "message": "Lead deleted successfully" }`

> **RBAC:** Admin only. Sales users receive `403 Forbidden`.

---

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `401` | Unauthenticated (missing/invalid/expired token) |
| `403` | Forbidden (insufficient role or ownership) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email on register) |
| `422` | Mongoose validation error |
| `500` | Internal server error |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | ❌ | `development` | Environment (`development` / `production` / `test`) |
| `PORT` | ❌ | `5001` | Port the API server binds to |
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | JWT signing secret (minimum 32 characters) |
| `JWT_EXPIRES_IN` | ❌ | `7d` | Token expiry duration |
| `CLIENT_URL` | ❌ | `http://localhost:5173` | Allowed CORS origin |
| `BCRYPT_SALT_ROUNDS` | ❌ | `12` | bcrypt hashing rounds |

### Root (`.env` for docker-compose)

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | ✅ | Passed into the server Docker container |

---

## Deployment Guide

### Option 1: Render (Recommended — Free Tier)

A `render.yaml` is included for one-click deployment.

#### Step 1: Create a MongoDB Atlas cluster

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create a free M0 cluster
2. Create a database user and whitelist `0.0.0.0/0` for Render IPs
3. Copy the connection string: `mongodb+srv://user:pass@cluster.mongodb.net/smart-leads`

#### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo: `shivank-alloo/serviceHive_fullstack_assignment`
3. **Root Directory:** `server`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `node dist/server.js`
6. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-secret-here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-frontend.vercel.app
   ```

#### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `shivank-alloo/serviceHive_fullstack_assignment`
3. **Root Directory:** `client`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variable:**
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```

> **Note:** Update `client/src/api/axios.ts` baseURL to use `VITE_API_URL` for production.

---

### Option 2: Docker (Self-hosted / VPS)

```bash
# On your server
git clone https://github.com/shivank-alloo/serviceHive_fullstack_assignment.git
cd serviceHive_fullstack_assignment
cp .env.example .env
# Set JWT_SECRET in .env
docker-compose up -d --build
```

---

## Design Decisions

| Decision | Rationale |
|---|---|
| **httpOnly cookies** | Tokens stored in httpOnly cookies prevent XSS attacks that could steal localStorage tokens |
| **Service layer** | Business logic separated from controllers — services are independently testable |
| **RBAC at data layer** | Ownership checks in `lead.service.ts` mean even if middleware is misconfigured, data remains protected |
| **Parallel count + find** | `Promise.all([Lead.find(), Lead.countDocuments()])` halves response time for paginated queries |
| **Debounce at 300ms** | Balances UI responsiveness with API load — user stops typing before query fires |
| **Generic error message on login** | `"Invalid email or password"` prevents user enumeration attacks |
| **Compound DB index** | `{ createdBy: 1, createdAt: -1 }` serves the most common RBAC + sort query in a single index scan |
| **Lazy-loaded pages** | React.lazy splits each page into its own JS chunk — Login bundle is ~3.5kb gzipped |
| **placeholderData in React Query** | Stale data stays visible during page transitions — avoids content flash on pagination |
| **`noUnusedLocals` + `noUnusedParameters`** | Strict TS flags catch dead code at compile time, not runtime |

---

## License

MIT © 2026 Shivank Tiwari
