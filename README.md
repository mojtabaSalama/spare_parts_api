# Spare Parts API

Backend API for managing spare parts inventory at a spare parts store. Built with Node.js, Express, Sequelize (MySQL), and JWT bearer authentication.

## Features

- JWT authentication with refresh tokens and role-based access (`admin`, `staff`)
- CRUD for spare parts, categories, and suppliers
- Stock in / stock out / adjustment endpoints, each writing an immutable audit trail (`StockMovement`)
- Low-stock detection based on each part's `minStockLevel`
- Centralized error handling and consistent JSON response shape
- Request validation with Joi

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and strong, distinct `JWT_SECRET` and `JWT_REFRESH_SECRET` values. If `JWT_REFRESH_SECRET` is omitted, the application derives a separate refresh signing key from `JWT_SECRET`.

3. **Create the database** (MySQL)
   ```sql
   CREATE DATABASE spare_parts_db;
   ```

4. **Run migrations** (if you generate them with sequelize-cli) or let the app auto-sync in development:
   ```bash
   npm run dev
   ```
   In development mode, `server.js` calls `sequelize.sync({ alter: true })` automatically, so tables are created/updated on startup. In production, use proper migrations instead (`npm run db:migrate`).

5. **(Optional) Seed a default admin account**
   ```bash
   npm run db:seed
   ```
   Default login after seeding:
   - Email: `admin@spareparts.com`
   - Password: `Admin@1234`

   ⚠️ Change this password immediately in any real deployment.

## Running

```bash
npm run dev     # development, with nodemon auto-restart
npm start       # production
```

Server starts on `http://localhost:5000` by default (or whatever `PORT` you set in `.env`).

## API Overview

All routes are prefixed with `/api`.

### Auth
| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create a new user account |
| POST | `/auth/login` | No | Log in, returns an access token and refresh token |
| POST | `/auth/refresh` | No | Exchange `{ "refreshToken": "..." }` for a new access and refresh token pair |
| GET | `/auth/me` | Yes | Get the current authenticated user |

### Parts
| Method | Route | Auth required | Role |
|---|---|---|---|
| GET | `/parts` | Yes | any |
| GET | `/parts?search=&categoryId=&lowStockOnly=true` | Yes | any |
| GET | `/parts/low-stock` | Yes | any |
| GET | `/parts/:id` | Yes | any |
| POST | `/parts` | Yes | admin |
| PUT | `/parts/:id` | Yes | admin |
| DELETE | `/parts/:id` | Yes | admin |

### Categories / Suppliers
Same pattern: `GET` open to any authenticated user, `POST`/`PUT`/`DELETE` restricted to `admin`.

### Stock
| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/stock/in` | Yes | `{ partId, quantity, reason }` — increases stock |
| POST | `/stock/out` | Yes | `{ partId, quantity, reason }` — decreases stock (refuses if insufficient) |
| POST | `/stock/adjust` | Yes | `{ partId, newQuantity, reason }` — sets an explicit count |
| GET | `/stock/movements/:partId` | Yes | Full movement history for one part |

## Auth header format

```
Authorization: Bearer <your-jwt-token>
```

## Project structure

```
src/
├── config/        # env loading, Sequelize connection config
├── models/        # Sequelize models (User, Part, Category, Supplier, StockMovement)
├── controllers/   # request/response handling
├── routes/        # Express routers
├── middlewares/   # auth, role, validation, error handling
├── services/      # business logic, separated from controllers
├── validators/    # Joi request schemas
├── utils/         # response helpers, custom error class, logger
├── migrations/    # sequelize-cli migrations (generate with `sequelize-cli model:generate`)
├── seeders/       # sequelize-cli seed data
├── app.js         # Express app setup
└── server.js      # entry point
```
