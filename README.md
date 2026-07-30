# AutoApex - Car Dealership Inventory System

A production-quality, full-stack Car Dealership Inventory System built with Python 3.12, FastAPI, PostgreSQL, SQLAlchemy 2.0, React, Vite, and Tailwind CSS adhering strictly to Test-Driven Development (TDD) principles.

---

## Table of Contents

1. [Project Title](#autoapex---car-dealership-inventory-system)
2. [Project Overview](#project-overview)
3. [Main Features](#main-features)
4. [Screenshots](#screenshots)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Folder Structure](#folder-structure)
8. [Database Design](#database-design)
9. [API Documentation](#api-documentation)
10. [Authentication and Authorization](#authentication-and-authorization)
11. [Prerequisites](#prerequisites)
12. [Backend Setup Instructions](#backend-setup-instructions)
13. [PostgreSQL Setup Instructions](#postgresql-setup-instructions)
14. [Environment Variable Setup](#environment-variable-setup)
15. [Alembic Migration Commands](#alembic-migration-commands)
16. [Admin Seed Instructions](#admin-seed-instructions)
17. [Backend Run Command](#backend-run-command)
18. [Frontend Setup Instructions](#frontend-setup-instructions)
19. [Frontend Environment Variables](#frontend-environment-variables)
20. [Frontend Run Command](#frontend-run-command)
21. [Test Commands](#test-commands)
22. [Coverage Report Instructions](#coverage-report-instructions)
23. [Test Report](#test-report)
24. [API Examples](#api-examples)
25. [Security Decisions](#security-decisions)
26. [TDD Process](#tdd-process)
27. [Git Commit Approach](#git-commit-approach)
28. [Deployment Instructions](#deployment-instructions)
29. [Known Limitations](#known-limitations)
30. [Future Improvements](#future-improvements)
31. [My AI Usage](#my-ai-usage)
32. [License](#license)

---

## 1. Project Title
**AutoApex Car Dealership Inventory System**

---

## 2. Project Overview
AutoApex is an enterprise-grade vehicle procurement and inventory management platform designed for car dealerships. It enables customers to browse, filter, and purchase vehicles online with real-time stock updates, while providing dealership administrators with full control to add, edit, delete, and restock vehicles securely.

---

## 3. Main Features
- **Role-Based Access Control**: `customer` and `admin` role separation. Public registration safely defaults to `customer`.
- **JWT Authentication**: Secure Bearer tokens with client-side session restoration (`GET /api/auth/me`).
- **Multi-Filter Search**: Case-insensitive search by make, model, category, minimum price, and maximum price.
- **Concurrency-Safe Purchasing**: Atomic database transactions using PostgreSQL row-level locks (`SELECT FOR UPDATE`) to prevent negative inventory under concurrent purchasing.
- **Out of Stock Guard**: Displays out-of-stock badges and disables purchase buttons when quantity is 0.
- **Admin Inventory Panel**: Add, edit, delete, and restock vehicle inventory.
- **Modern Glassmorphism UI**: High-contrast, dark-mode React interface with smooth micro-animations.

---

## 4. Screenshots

### User Authentication
| Login Interface | Registration Form |
| :---: | :---: |
| ![Login Page](docs/screenshots/login.png) | ![Registration Page](docs/screenshots/register.png) |

### Customer Dashboard & Inventory Search
| Vehicle Inventory Catalog | Multi-Filter Search Results |
| :---: | :---: |
| ![Catalog Dashboard](docs/screenshots/dashboard.png) | ![Search & Filter Results](docs/screenshots/search-results.png) |

### Vehicle Purchasing & Out-of-Stock Handling
| Out of Stock Badging | Vehicle Purchase Flow |
| :---: | :---: |
| ![Out of Stock Badge](docs/screenshots/out-of-stock.png) | ![Purchase Success](docs/screenshots/purchase-success.png) |

### Administrative Management Panel
| Dealership Inventory Table | Add New Vehicle Form | Edit Vehicle Form |
| :---: | :---: | :---: |
| ![Admin Inventory](docs/screenshots/admin-inventory.png) | ![Add Vehicle](docs/screenshots/add-vehicle.png) | ![Edit Vehicle](docs/screenshots/edit-vehicle.png) |

### API Documentation & Automated Testing
| FastAPI Interactive Swagger Docs (`/docs`) | Pytest Backend Test Suite (40 Passed) | Vitest Frontend Test Suite (29 Passed) |
| :---: | :---: | :---: |
| ![Swagger Docs](docs/screenshots/swagger-docs.png) | ![Backend Tests](docs/screenshots/backend-tests.png) | ![Frontend Tests](docs/screenshots/frontend-tests.png) |

---

## 5. Technology Stack

### Backend
- **Python**: 3.12
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM & Migrations**: SQLAlchemy 2.0 & Alembic
- **Validation**: Pydantic v2
- **Security**: PyJWT, Direct `bcrypt`
- **Testing**: Pytest, FastAPI TestClient, pytest-cov
- **Code Quality**: Ruff (linting), Black (formatting)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS3
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (Request Interceptors)
- **Testing**: Vitest, React Testing Library

---

## 6. System Architecture

```text
[ React SPA (Vite) ] ── (Axios + JWT Bearer Header) ──> [ FastAPI Routes ]
                                                              │
                                                       [ Service Layer ] (Business Rules & Transactions)
                                                              │
                                                     [ Repository Layer ] (Data Access)
                                                              │
                                                     [ SQLAlchemy 2.0 ORM ]
                                                              │
                                                     [ PostgreSQL Database ]
```

---

## 7. Folder Structure

```text
car-dealership/
├── backend/
│   ├── app/
│   │   ├── api/ (dependencies.py, routes/)
│   │   ├── core/ (config.py, security.py, exceptions.py)
│   │   ├── database/ (base.py, session.py, models.py)
│   │   ├── repositories/ (user_repository.py, vehicle_repository.py)
│   │   ├── schemas/ (auth.py, user.py, vehicle.py, inventory.py)
│   │   ├── scripts/ (seed_admin.py, seed_vehicles.py)
│   │   └── services/ (auth_service.py, vehicle_service.py, inventory_service.py)
│   ├── alembic/
│   ├── tests/ (unit/, integration/)
│   ├── pyproject.toml
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/ (axiosInstance.js, authApi.js, vehicleApi.js)
│   │   ├── components/ (Navbar, ProtectedRoute, AdminRoute, VehicleCard, etc.)
│   │   ├── context/ (AuthContext.jsx)
│   │   ├── pages/ (LoginPage, RegisterPage, DashboardPage, AdminVehiclesPage, etc.)
│   │   ├── routes/ (AppRoutes.jsx)
│   │   └── utils/ (currency.js, validation.js)
│   ├── package.json
│   └── vite.config.js
├── docs/screenshots/
├── PROMPTS.md
├── README.md
└── TEST_REPORT.md
```

---

## 8. Database Design
- **`users`**: `id`, `full_name`, `email` (unique index, normalized), `password_hash`, `role` (check in `'customer'`, `'admin'`), `is_active`, `created_at`, `updated_at`.
- **`vehicles`**: `id`, `make` (index), `model` (index), `category` (index), `price` (`NUMERIC(12,2)` check > 0), `quantity` (`INTEGER` check >= 0), `year`, `color`, `image_url`, `description`, `created_at`, `updated_at`.

---

## 9. API Documentation
Swagger UI documentation is available at `http://localhost:8000/docs` when running the backend.

---

## 10. Authentication and Authorization
- **Authentication**: JWT access tokens signed with `HS256`. Attached via Axios request interceptor `Authorization: Bearer <token>`.
- **Authorization**: `get_current_user` extracts and validates tokens; `require_admin` restricts endpoints to `admin` users (HTTP 403 Forbidden).

---

## 11. Prerequisites
- **Python**: 3.12+
- **Node.js**: v18+ & npm
- **PostgreSQL**: 14+

---

## 12. Backend Setup Instructions (PowerShell)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 13. PostgreSQL Setup Instructions
```sql
CREATE DATABASE car_dealership;
CREATE DATABASE car_dealership_test;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE car_dealership TO postgres;
GRANT ALL PRIVILEGES ON DATABASE car_dealership_test TO postgres;
```

---

## 14. Environment Variable Setup
Copy `.env.example` to `.env` in `backend/`:
```env
APP_NAME=AutoApex Dealership System
APP_ENV=development
DEBUG=true
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/car_dealership
TEST_DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/car_dealership_test
JWT_SECRET_KEY=replace-with-a-secure-random-64-character-hex-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
```

---

## 15. Alembic Migration Commands
```powershell
cd backend
.\.venv\Scripts\alembic.exe upgrade head
```

---

## 16. Admin Seed Instructions
```powershell
cd backend
$env:ADMIN_EMAIL="<your-admin-email@example.com>"
$env:ADMIN_PASSWORD="<choose-a-strong-password>"
.\.venv\Scripts\python.exe -m app.scripts.seed_admin
```

---

## 17. Backend Run Command
```powershell
cd backend
.\.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

---

## 18. Frontend Setup Instructions
```powershell
cd frontend
npm install
```

---

## 19. Frontend Environment Variables
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 20. Frontend Run Command
```powershell
cd frontend
npm run dev
```

---

## 21. Test Commands

### Backend Tests
```powershell
cd backend
.\.venv\Scripts\pytest.exe
```

### Frontend Tests
```powershell
cd frontend
npm run test
```

---

## 22. Coverage Report Instructions
```powershell
cd backend
.\.venv\Scripts\pytest.exe --cov=app --cov-report=term-missing --cov-report=html
```

---

## 23. Test Report
The repository contains 69 passed automated tests across full-stack backend and frontend test suites:
- **Backend (Pytest)**: 40 passed tests (97% total line coverage)
- **Frontend (Vitest)**: 29 passed tests across 10 test files

See complete test metrics, PostgreSQL concurrency locking verification, and coverage breakdown in [TEST_REPORT.md](file:///c:/Users/akank/Desktop/Car_dealership/TEST_REPORT.md).

---

## 24. API Examples

### Register Customer
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "Akanksha Kumari",
  "email": "akanksha@example.com",
  "password": "Password@123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "akanksha@example.com",
  "password": "Password@123"
}
```

### Purchase Vehicle
```http
POST /api/vehicles/1/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1
}
```

---

## 25. Security Decisions
- Passwords hashed using direct `bcrypt`.
- Passwords **never** stored or returned in plain text.
- Public registration payload `"role": "admin"` ignored; server forces `customer`.
- Row-level database locking `SELECT FOR UPDATE` prevents concurrent stock depletion.

---

## 26. TDD Process
Strict Red-Green-Refactor cycle followed:
1. **RED**: Write failing test first.
2. **GREEN**: Implement minimal code to pass test.
3. **REFACTOR**: Format with Black and Ruff without breaking tests.
4. **COMMIT**: Commit with AI co-author trailer format.

---

## 27. Git Commit Approach
Granular commits per feature with structured commit titles and AI co-author trailers:
```text
feat(auth): implement user registration

Used Gemini to generate initial service structure and test cases.
Reviewed code, added role restrictions, and verified database behavior.


Co-authored-by: Gemini <AI@users.noreply.github.com>
```

---

## 28. Deployment Instructions
- **Frontend**: Deploy `frontend/dist` to Netlify or Vercel with `VITE_API_BASE_URL` pointing to backend.
- **Backend**: Deploy `backend/` to Render or Railway with production environment variables and execute `alembic upgrade head`.

---

## 29. Known Limitations
- Current deletion drops vehicle records permanently; soft-deletion can be added for historical audit logs.

---

## 30. Future Improvements
- Refresh token rotation.
- Real-time WebSocket notifications on stock changes.

---

## 31. My AI Usage

### Tools used
- Gemini 3.6 Flash (via Antigravity IDE)

### How I used AI
I used AI as a pair programming mentor to help architect the multi-tier system, plan TDD test cases, guide Git commit boundaries, and design the API contract. I reviewed every generated suggestion, ensured strict compliance with business requirements, and verified code execution through automated pytest and Vitest test suites.

### My verification process
I did not accept generated code blindly. I checked the implementation, ran the test suite, reviewed database migrations, tested API endpoints, and modified generated suggestions when they did not match the project requirements.

### Reflection
AI helped me work faster and consider edge cases that I might otherwise have missed. It was most useful for planning, test-case brainstorming, and debugging. However, I remained responsible for technical decisions, code review, validation, and the final implementation.

---

## 32. License
MIT License.
