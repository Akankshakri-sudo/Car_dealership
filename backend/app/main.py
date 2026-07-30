from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, vehicles
from app.core.config import settings
from app.core.exceptions import AppException, app_exception_handler

app = FastAPI(
    title=settings.APP_NAME,
    description="Car Dealership Inventory Management API",
    version="1.0.0",
)

# CORS Middleware Configuration
origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()]
for default_origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
    if default_origin not in origins:
        origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Custom Exception Handler
app.add_exception_handler(AppException, app_exception_handler)

# Include API Routers under /api prefix
api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(vehicles.router)


@api_router.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}


app.include_router(api_router)
