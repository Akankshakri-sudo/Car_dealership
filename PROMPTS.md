# AI Prompt History

## Entry 1

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Master project specification, requirement interpretation, architecture design, database schema, API contracts, folder structure, TDD strategy, and Git commit roadmap.

### My prompt

> You are my senior full-stack software engineer, TDD mentor, Git mentor, and code reviewer.
>
> Help me build a complete, production-quality **Car Dealership Inventory System** from scratch. I am a student, so explain every important step in simple language and never skip setup instructions.
>
> [Full Master Prompt Submitted]

### AI response summary

Created Phase 1 Planning & Architecture Specification (`implementation_plan.md`) covering requirement traceability checklist, system architecture, PostgreSQL database ER schema, standard API error formats, API endpoints specification, directory structures, TDD testing strategy, proposed Git commit roadmap, PROMPTS.md recording strategy, Definition of Done, and risk mitigation strategy.

### Files affected

- `implementation_plan.md`
- `PROMPTS.md`
- `.gitignore`

### What I accepted

Accepted the full Phase 1 specification and architectural plan without modifications.

### What I changed manually

N/A (Initial planning phase)

### Verification

Verified that all 27 project requirements, authorization rules, inventory transaction locking rules, and API specifications are accurately mapped and addressed in the Phase 1 implementation plan.

## Entry 2

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 2 Repository Setup (Git init, .gitignore, README.md, PROMPTS.md, backend requirements & env templates, frontend package & Vite/Tailwind configuration).

### My prompt

> Execute Phase 2: Repository Setup.

### AI response summary

Initialized Git repository, generated root `.gitignore`, initial `README.md`, `PROMPTS.md` prompt history log, backend configuration templates (`requirements.txt`, `.env.example`), created Python virtual environment `.venv`, and set up frontend React/Vite/Tailwind configuration (`package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`).

### Files affected

- `.gitignore`
- `README.md`
- `PROMPTS.md`
- `backend/.env.example`
- `backend/requirements.txt`
- `frontend/.env.example`
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/index.html`

### What I accepted

Accepted all project boilerplate files and directory structure configs.

### What I changed manually

N/A

### Verification

Verified Git initialization (`git status`), verified creation of Python virtual environment `.venv`, and executed initial Git commit with AI co-author trailer format.

## Entry 3

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 3 Backend Foundation (FastAPI setup, settings config, GET /api/health endpoint via TDD, custom exception handling, SQLAlchemy 2.0 base & session setup, Alembic environment, and Pytest test fixtures).

### My prompt

> Execute Phase 3: Backend Foundation.

### AI response summary

Followed strict TDD workflow to implement the `/api/health` check endpoint (RED -> GREEN -> REFACTOR). Created app settings (`app/core/config.py`), standardized exception handlers (`app/core/exceptions.py`), main FastAPI application (`app/main.py`), database model base (`app/database/base.py`), database session maker (`app/database/session.py`), test fixtures (`tests/conftest.py`), and Alembic migrations configuration (`alembic/env.py`). Achieved 100% test coverage.

### Files affected

- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/core/exceptions.py`
- `backend/app/database/base.py`
- `backend/app/database/session.py`
- `backend/alembic.ini`
- `backend/alembic/env.py`
- `backend/alembic/script.py.mako`
- `backend/tests/conftest.py`
- `backend/tests/unit/test_health.py`
- `backend/tests/unit/test_exceptions.py`
- `backend/tests/unit/test_database.py`
- `backend/tests/unit/test_session.py`

### What I accepted

Accepted TDD test cases, exception formatting, database session generator patterns, and Alembic configuration.

### What I changed manually

N/A

### Verification

Executed `pytest --cov=app --cov-report=term-missing`, verified 4/4 passing tests with 100% code coverage, ran Ruff linting and Black formatting cleanly, and committed changes to Git.

## Entry 4

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 4 Authentication (User entity model, bcrypt security utilities, JWT creation/validation, Pydantic schemas, User repository, AuthService, Auth API endpoints, role dependencies, admin seed script, and unit/integration test suite).

### My prompt

> Execute Phase 4: Authentication.

### AI response summary

Followed strict TDD workflow to implement security utilities (`app/core/security.py`), User database entity (`app/database/models.py`), request/response schemas (`app/schemas/user.py`, `app/schemas/auth.py`), user repository (`app/repositories/user_repository.py`), authentication business service (`app/services/auth_service.py`), API endpoints (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`), authorization guards (`app/api/dependencies.py`), and admin seed script (`app/scripts/seed_admin.py`).

### Files affected

- `backend/app/database/models.py`
- `backend/app/core/security.py`
- `backend/app/schemas/user.py`
- `backend/app/schemas/auth.py`
- `backend/app/repositories/user_repository.py`
- `backend/app/services/auth_service.py`
- `backend/app/api/dependencies.py`
- `backend/app/api/routes/auth.py`
- `backend/app/scripts/seed_admin.py`
- `backend/alembic/versions/2026_07_29_0001_create_users_table.py`
- `backend/tests/unit/test_security.py`
- `backend/tests/unit/test_auth_unit.py`
- `backend/tests/unit/test_seed_admin_and_deps.py`
- `backend/tests/integration/test_auth_api.py`

### What I accepted

Accepted password hashing rules, JWT authorization workflow, customer role safety enforcement, and test suite definitions.

### What I changed manually

N/A

### Verification

Executed `pytest --cov=app --cov-report=term-missing`, verified 22/22 passing tests with 96% backend code coverage, ran Ruff linting and Black formatting cleanly, and committed changes to Git.

## Entry 5

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 5 Vehicle Management (Vehicle entity model with NUMERIC price and INTEGER quantity check constraints, Pydantic v2 schemas, repository, service, API endpoints for creation, listing, multi-filter search, updating, deleting, seed script, and integration test suite).

### My prompt

> Execute Phase 5: Vehicle Management.

### AI response summary

Followed strict TDD workflow to implement `Vehicle` entity model (`app/database/models.py`), Pydantic schemas (`app/schemas/vehicle.py`), vehicle repository (`app/repositories/vehicle_repository.py`), vehicle service (`app/services/vehicle_service.py`), API endpoints (`app/api/routes/vehicles.py`), sample vehicle seed script (`app/scripts/seed_vehicles.py`), and Alembic migration (`alembic/versions/2026_07_29_0002_create_vehicles_table.py`). Guaranteed route precedence by declaring `/api/vehicles/search` prior to path parameter routes.

### Files affected

- `backend/app/database/models.py`
- `backend/app/schemas/vehicle.py`
- `backend/app/repositories/vehicle_repository.py`
- `backend/app/services/vehicle_service.py`
- `backend/app/api/routes/vehicles.py`
- `backend/app/main.py`
- `backend/app/scripts/seed_vehicles.py`
- `backend/alembic/versions/2026_07_29_0002_create_vehicles_table.py`
- `backend/tests/integration/test_vehicles_api.py`
- `backend/tests/unit/test_vehicle_unit.py`

### What I accepted

Accepted route declaration order precedence, case-insensitive substring matching for search, numeric database types, and test assertions.

### What I changed manually

N/A

### Verification

Executed `pytest --cov=app --cov-report=term-missing`, verified 32/32 passing tests with 97% backend code coverage, ran Ruff linting and Black formatting cleanly, and committed changes to Git.

## Entry 6

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 6 Inventory Operations (Atomic vehicle purchase engine with PostgreSQL row-level locks, insufficient stock error handling, atomic quantity deduction, admin restocking service, Pydantic schemas, API endpoints, and integration/unit test suite).

### My prompt

> Execute Phase 6: Inventory Operations.

### AI response summary

Followed strict TDD workflow to implement `InventoryService` (`app/services/inventory_service.py`), schemas (`app/schemas/inventory.py`), and routes (`POST /api/vehicles/{id}/purchase`, `POST /api/vehicles/{id}/restock`). Ensured concurrency safety using SQLAlchemy `.with_for_update()` row-level locks within database transactions. Raised HTTP 409 `INSUFFICIENT_STOCK` on stock shortages.

### Files affected

- `backend/app/schemas/inventory.py`
- `backend/app/services/inventory_service.py`
- `backend/app/api/routes/vehicles.py`
- `backend/tests/integration/test_inventory_api.py`
- `backend/tests/unit/test_inventory_unit.py`

### What I accepted

Accepted database row locking strategy (`SELECT FOR UPDATE`), stock threshold validation, and transaction rollback handling.

### What I changed manually

N/A

### Verification

Executed `pytest --cov=app --cov-report=term-missing`, verified 40/40 passing tests with 97% backend code coverage, ran Ruff linting and Black formatting cleanly, and committed changes to Git.

## Entry 7

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 7 Backend Quality (Full backend test suite execution, HTML coverage report generation, code formatting audit, OpenAPI/Swagger API schema review, and creation of TEST_REPORT.md).

### My prompt

> Execute Phase 7: Backend Quality.

### AI response summary

Executed `pytest --cov=app --cov-report=term-missing --cov-report=html` generating full HTML coverage report under `backend/htmlcov/`. Audited code formatting with Black and Ruff, verified OpenAPI Swagger schemas, and generated `TEST_REPORT.md` documenting 40 passing tests and 97% code coverage metrics across all backend modules.

### Files affected

- `TEST_REPORT.md`
- `PROMPTS.md`

### What I accepted

Accepted coverage reporting format, module metrics summary table, and documented business scenario verifications.

### What I changed manually

N/A

### Verification

Verified 40/40 tests passing in 4.77 seconds, verified 97% total line coverage, generated HTML report, and committed to Git.

## Entry 8

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 8 Frontend Foundation (NPM dependency installation, Axios client configuration with JWT request interceptors, API service modules, AuthContext, Tailwind CSS glassmorphism design system, and reusable UI components).

### My prompt

> Execute Phase 8: Frontend Foundation.

### AI response summary

Installed frontend npm packages, created Axios instance (`src/api/axiosInstance.js`), API service wrappers (`src/api/authApi.js`, `src/api/vehicleApi.js`), global `AuthContext` (`src/context/AuthContext.jsx`), glassmorphism CSS design system (`src/index.css`), and reusable UI components (`Navbar`, `ProtectedRoute`, `AdminRoute`, `VehicleCard`, `SearchFilters`, `LoadingSpinner`, `EmptyState`, `ErrorMessage`, `ConfirmDialog`).

### Files affected

- `frontend/src/api/axiosInstance.js`
- `frontend/src/api/authApi.js`
- `frontend/src/api/vehicleApi.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/index.css`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/AdminRoute.jsx`
- `frontend/src/components/VehicleCard.jsx`
- `frontend/src/components/SearchFilters.jsx`
- `frontend/src/components/LoadingSpinner.jsx`
- `frontend/src/components/EmptyState.jsx`
- `frontend/src/components/ErrorMessage.jsx`
- `frontend/src/components/ConfirmDialog.jsx`
- `frontend/src/utils/currency.js`
- `frontend/src/utils/validation.js`

### What I accepted

Accepted Axios interceptor pattern for JWT tokens, glassmorphism design system tokens, and reusable component structure.

### What I changed manually

N/A

### Verification

Verified npm package installation (`386 packages added`), verified Axios token interceptors, and committed changes to Git.

## Entry 9

**Date:** 2026-07-29  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 9, 10, and 11 Frontend Authentication, Dashboard, Admin UI, and Vitest Component Tests (`RegisterPage`, `LoginPage`, `DashboardPage`, `AdminVehiclesPage`, `AddVehiclePage`, `EditVehiclePage`, `NotFoundPage`, `AppRoutes`, and Vitest test suite).

### My prompt

> Execute Phase 9, 10, and 11: Frontend Authentication, Dashboard, and Admin UI.

### AI response summary

Created React pages for customer registration (`RegisterPage.jsx`), user login (`LoginPage.jsx`), responsive vehicle dashboard (`DashboardPage.jsx`), administrative inventory management (`AdminVehiclesPage.jsx`), add vehicle form (`AddVehiclePage.jsx`), edit vehicle form (`EditVehiclePage.jsx`), 404 page (`NotFoundPage.jsx`), application route definitions (`AppRoutes.jsx`), and Vitest component test suites (`auth.test.jsx`, `dashboard.test.jsx`).

### Files affected

- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/AdminVehiclesPage.jsx`
- `frontend/src/pages/AddVehiclePage.jsx`
- `frontend/src/pages/EditVehiclePage.jsx`
- `frontend/src/pages/NotFoundPage.jsx`
- `frontend/src/routes/AppRoutes.jsx`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/tests/setup.js`
- `frontend/src/tests/auth.test.jsx`
- `frontend/src/tests/dashboard.test.jsx`

### What I accepted

Accepted client-side form validation rules, out-of-stock button disabling logic, admin dialog modals, and Vitest test assertions.

### What I changed manually

N/A

### Verification

Executed `npm run test` inside `frontend`, verifying 3/3 passing Vitest component tests, and committed changes to Git.

## Entry 11

**Date:** 2026-07-30  
**AI tool:** Gemini 3.6 Flash  
**Purpose:** Phase 13 Submission Readiness & Review Improvements (Real UI screenshots in `docs/screenshots/`, frontend Vitest test suite expansion from 3 to 29 tests across 10 test files, admin seed credential sanitization in `README.md`, PostgreSQL concurrency & row locking documentation in `TEST_REPORT.md`, and 69 total tests verification).

### My prompt

> Execute Phase 13: Submission Readiness Improvements (screenshots, frontend test suite expansion, credential sanitization, PostgreSQL concurrency verification).

### AI response summary

Captured 12 real UI screenshots of the running FastAPI backend and React frontend application placing them in `docs/screenshots/` and embedding them in Section 4 of `README.md`. Expanded the frontend Vitest test suite from 3 tests to 29 tests across 10 test files (`auth-context.test.jsx`, `protected-route.test.jsx`, `admin-route.test.jsx`, `search-filters.test.jsx`, `vehicle-card.test.jsx`, `purchase.test.jsx`, `admin-vehicles.test.jsx`, `vehicle-form.test.jsx`, `auth.test.jsx`, `dashboard.test.jsx`). Sanitized admin seed example credentials in `README.md` with explicit placeholder variables. Enhanced `TEST_REPORT.md` and `README.md` to document SQLite unit test execution and PostgreSQL row-level lock concurrency verification (`SELECT FOR UPDATE`).

### Files affected

- `docs/screenshots/login.png`
- `docs/screenshots/register.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/search-results.png`
- `docs/screenshots/out-of-stock.png`
- `docs/screenshots/purchase-success.png`
- `docs/screenshots/admin-inventory.png`
- `docs/screenshots/add-vehicle.png`
- `docs/screenshots/edit-vehicle.png`
- `docs/screenshots/swagger-docs.png`
- `docs/screenshots/backend-tests.png`
- `docs/screenshots/frontend-tests.png`
- `frontend/src/tests/auth-context.test.jsx`
- `frontend/src/tests/protected-route.test.jsx`
- `frontend/src/tests/admin-route.test.jsx`
- `frontend/src/tests/search-filters.test.jsx`
- `frontend/src/tests/vehicle-card.test.jsx`
- `frontend/src/tests/purchase.test.jsx`
- `frontend/src/tests/admin-vehicles.test.jsx`
- `frontend/src/tests/vehicle-form.test.jsx`
- `README.md`
- `TEST_REPORT.md`
- `PROMPTS.md`

### What I accepted

Accepted screenshot embeds, expanded Vitest test suite coverage for auth context, route protection, admin inventory CRUD, search filters, and vehicle form validation, as well as sanitized credential placeholders.

### What I changed manually

N/A

### Verification

Executed `npm test` inside `frontend/` verifying 29/29 passing Vitest tests across 10 test files. Executed `pytest` inside `backend/` verifying 40/40 passing Pytest tests with 97% line coverage (69 total full-stack tests). Verified all 12 screenshot embeds rendered in `README.md`, verified clean git co-author commit trailers, and completed submission audit.









