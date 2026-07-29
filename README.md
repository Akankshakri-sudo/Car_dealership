# AutoApex - Car Dealership Inventory System

A production-quality full-stack Car Dealership Inventory System built with Python FastAPI, PostgreSQL, SQLAlchemy 2.0, React, Vite, and Tailwind CSS following strict Test-Driven Development (TDD) principles.

---

## Table of Contents

- [Overview](#overview)
- [Main Features](#main-features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Prerequisites](#prerequisites)
- [Backend Setup Instructions](#backend-setup-instructions)
- [PostgreSQL Setup Instructions](#postgresql-setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Admin Seed Instructions](#admin-seed-instructions)
- [Running the Application](#running-the-application)
- [Frontend Setup Instructions](#frontend-setup-instructions)
- [Test Commands](#test-commands)
- [Coverage Report](#coverage-report)
- [Security Decisions](#security-decisions)
- [TDD & Git Workflow](#tdd--git-workflow)
- [My AI Usage](#my-ai-usage)
- [License](#license)

---

## Overview

**AutoApex** is a full-stack inventory management and vehicle procurement web application designed for car dealerships. It allows customers to browse, search, and purchase vehicles online, while empowering dealership administrators to manage inventory, update vehicle pricing and details, restock vehicles, and track stock levels securely in real-time.

---

## Main Features

- **User Authentication & Authorization**: Secure JWT-based authentication supporting `customer` and `admin` roles. Default self-registration assigns `customer` role safely.
- **Vehicle Inventory Catalog**: View available inventory with real-time stock status (in stock vs out of stock).
- **Multi-Filter Vehicle Search**: Search by make, model, category, minimum price, and maximum price with instant backend filtering.
- **Concurrency-Safe Purchase Engine**: Atomic database transactions using PostgreSQL row-level locks (`SELECT FOR UPDATE`) to ensure inventory never goes negative during peak user purchasing.
- **Admin Inventory Control**: Restrict vehicle addition, updates, deletion, and restocking to authenticated administrative users.
- **Responsive Dashboard UI**: Modern, glassmorphism-inspired, dark-mode React interface with dynamic state management and instant visual feedback.

---

## Screenshots

> Screenshot artifacts will be saved in `docs/screenshots/` once frontend pages and API documentation are fully generated.

- **Registration Page**: `docs/screenshots/register.png`
- **Login Page**: `docs/screenshots/login.png`
- **Vehicle Dashboard**: `docs/screenshots/dashboard.png`
- **Search & Filters**: `docs/screenshots/search-results.png`
- **Out-of-Stock State**: `docs/screenshots/out-of-stock.png`
- **Purchase Workflow**: `docs/screenshots/purchase-success.png`
- **Admin Inventory Panel**: `docs/screenshots/admin-inventory.png`
- **Swagger API Docs**: `docs/screenshots/swagger-docs.png`
- **Test Coverage Report**: `docs/screenshots/coverage-report.png`

---

## Technology Stack

### Backend
- **Language**: Python 3.12
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM & Migrations**: SQLAlchemy 2.0 & Alembic
- **Validation**: Pydantic v2
- **Security**: PyJWT, Passlib with Bcrypt/Argon2
- **Testing**: Pytest, HTTPX / FastAPI TestClient, pytest-cov
- **Code Quality**: Ruff (linting), Black (formatting)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS3
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with Request Interceptors)
- **Testing**: Vitest, React Testing Library

---

## System Architecture

The application follows a clean 4-tier architecture with strict separation of concerns:

```text
[ React Frontend (Vite) ] ── (Axios + JWT Bearer Header) ──> [ FastAPI Routes ]
                                                                   │
                                                            [ Service Layer ] (Business Rules & Transactions)
                                                                   │
                                                          [ Repository Layer ] (Data Isolation)
                                                                   │
                                                          [ SQLAlchemy 2.0 ORM ]
                                                                   │
                                                          [ PostgreSQL DB ]
```

---

## Folder Structure

```text
car-dealership/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── scripts/
│   ├── alembic/
│   ├── tests/
│   └── pyproject.toml / requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
├── docs/
│   └── screenshots/
├── .gitignore
├── PROMPTS.md
├── README.md
└── TEST_REPORT.md
```

---

## Database Design

- **`users`**: `id`, `full_name`, `email` (unique index, normalized lowercase), `password_hash`, `role` (`customer` | `admin`), `is_active`, `created_at`, `updated_at`.
- **`vehicles`**: `id`, `make` (index), `model` (index), `category` (index), `price` (`NUMERIC(12,2)`), `quantity` (`INTEGER >= 0`), `year`, `color`, `image_url`, `description`, `created_at`, `updated_at`.

---

## Environment Variables

### Backend `.env.example`
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

## My AI Usage

### Tools Used
- Gemini 3.6 Flash (via Antigravity IDE)

### How I Used AI
I used AI as a pair programming mentor to help architect the multi-tier system, plan TDD test cases, guide Git commit boundaries, and design the API contract. I reviewed every generated suggestion, ensured strict compliance with business requirements, and verified code execution through automated pytest and Vitest test suites.

### My Verification Process
I did not accept generated code blindly. I reviewed SQL migrations, verified atomic database transaction locks, executed unit and integration test suites, checked endpoint security, and enforced strict type hints and Pydantic validation schemas.

### Reflection
AI accelerated the scaffolding and test design process. However, enforcing business rules (such as zero negative inventory prevention, role authorization, and route order precedence) required deliberate review, manual verification, and rigorous testing.

---

## License
MIT License.
