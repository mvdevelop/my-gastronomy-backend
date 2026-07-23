# 🍽️ MyGastronomy Backend

A REST API for gastronomy management built with **TypeScript**, **Express**, and **MongoDB**. Manages dishes, ingredients, categories, users, and orders with JWT authentication and full CRUD operations.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 4
- **Language:** TypeScript 5 (strict mode)
- **Database:** MongoDB 6 (native driver)
- **Auth:** JWT + Passport.js (PBKDF2 password hashing)
- **Validation:** Custom declarative middleware
- **Logging:** Pino (structured JSON in production)
- **Testing:** Vitest + MongoDB Memory Server
- **Linting:** ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/mvdevelop/my-gastronomy-backend.git
cd my-gastronomy-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `MONGO_CS` | MongoDB connection string | `mongodb://localhost:27017/mygastronomy` |
| `MONGO_DB_NAME` | Database name | `mygastronomy` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | `change-me-in-production` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `RATE_LIMIT` | Requests per minute | `100` |
| `LOG_LEVEL` | Pino log level | `info` |

### Running

```bash
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled JS
```

## API Endpoints

All routes are prefixed with `/api/v1`.

### Public Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check (pings MongoDB) |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Authenticate and get JWT |

### Protected Routes (require `Authorization: Bearer <token>`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/users` | List all users |
| `PUT` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |
| `GET` | `/plates` | List all plates |
| `GET` | `/plates/availables` | List available plates |
| `POST` | `/plates` | Create a plate |
| `PUT` | `/plates/:id` | Update a plate |
| `DELETE` | `/plates/:id` | Delete a plate |
| `GET` | `/orders` | List all orders (aggregated with user + items) |
| `GET` | `/orders/userorders/:id` | List orders by user ID |
| `POST` | `/orders` | Create an order with items |
| `PUT` | `/orders/:id` | Update order status |
| `DELETE` | `/orders/:id` | Delete order and its items |

## Project Structure

```
src/
├── __tests__/           # Unit and integration tests
│   ├── dataAccess/      # MongoDB data access tests
│   ├── helpers/         # HTTP response helper tests
│   └── middleware/      # Auth and validation middleware tests
├── auth/                # Authentication routes (signup, login)
├── controllers/         # Business logic layer
├── dataAccess/          # MongoDB query layer
├── database/            # MongoDB connection singleton
├── helpers/             # HTTP response factories
├── middleware/           # Auth, validation, error handler, logger
├── routes/              # Express route definitions
├── types/               # TypeScript interfaces and DTOs
├── utils/               # Logger and utilities
├── validation/          # Route validation rules
└── index.ts             # Application entry point
```

## Testing

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

Tests use **MongoDB Memory Server** — no real database needed.

## Code Quality

```bash
npm run lint           # Check for lint errors
npm run lint:fix       # Auto-fix lint errors
npm run format         # Format with Prettier
npm run format:check   # Check formatting
npm run typecheck      # TypeScript type checking
```

## Docker

```bash
docker build -t mygastronomy .
docker run -e MONGO_CS=mongodb://host.docker.internal:27017/mygastronomy -p 3000:3000 mygastronomy
```

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- Type checking
- Linting
- Format verification
- Tests (Node 18 + 20)
- Build

## License

ISC

---

GitHub: [@mvdevelop](https://github.com/mvdevelop)
