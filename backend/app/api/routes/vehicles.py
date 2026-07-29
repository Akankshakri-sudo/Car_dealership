from decimal import Decimal

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_admin
from app.database.models import User
from app.database.session import get_db
from app.schemas.inventory import PurchaseRequest, PurchaseResponse, RestockRequest
from app.schemas.vehicle import (
    PaginatedVehicleResponse,
    VehicleCreateRequest,
    VehicleResponse,
    VehicleUpdateRequest,
)
from app.services.inventory_service import InventoryService
from app.services.vehicle_service import VehicleService

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    request: VehicleCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Add a new vehicle to dealership inventory (Admin only)."""
    vehicle_service = VehicleService(db)
    return vehicle_service.create_vehicle(request)


@router.get("", response_model=PaginatedVehicleResponse, status_code=status.HTTP_200_OK)
def list_vehicles(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all available vehicles including out-of-stock items (Authenticated)."""
    vehicle_service = VehicleService(db)
    return vehicle_service.list_vehicles(page=page, limit=limit)


# CRITICAL ROUTE ORDERING: /search MUST be declared BEFORE /{id}
@router.get(
    "/search", response_model=list[VehicleResponse], status_code=status.HTTP_200_OK
)
def search_vehicles(
    make: str | None = Query(default=None),
    model: str | None = Query(default=None),
    category: str | None = Query(default=None),
    min_price: Decimal | None = Query(default=None, ge=0),
    max_price: Decimal | None = Query(default=None, ge=0),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Search inventory using multi-filter parameters (Authenticated)."""
    vehicle_service = VehicleService(db)
    return vehicle_service.search_vehicles(
        make=make,
        model=model,
        category=category,
        min_price=min_price,
        max_price=max_price,
        page=page,
        limit=limit,
    )


@router.get("/{id}", response_model=VehicleResponse, status_code=status.HTTP_200_OK)
def get_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get vehicle details by ID (Authenticated)."""
    vehicle_service = VehicleService(db)
    return vehicle_service.get_vehicle_by_id(id)


@router.put("/{id}", response_model=VehicleResponse, status_code=status.HTTP_200_OK)
def update_vehicle(
    id: int,
    request: VehicleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update vehicle record completely (Admin only)."""
    vehicle_service = VehicleService(db)
    return vehicle_service.update_vehicle(id, request)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete a vehicle from inventory (Admin only)."""
    vehicle_service = VehicleService(db)
    vehicle_service.delete_vehicle(id)


@router.post(
    "/{id}/purchase", response_model=PurchaseResponse, status_code=status.HTTP_200_OK
)
def purchase_vehicle(
    id: int,
    request: PurchaseRequest = PurchaseRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Purchase a vehicle (Authenticated). Uses database transactions and row-level locking."""
    inventory_service = InventoryService(db)
    return inventory_service.purchase_vehicle(id, request)


@router.post(
    "/{id}/restock", response_model=VehicleResponse, status_code=status.HTTP_200_OK
)
def restock_vehicle(
    id: int,
    request: RestockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Restock a vehicle (Admin only)."""
    inventory_service = InventoryService(db)
    return inventory_service.restock_vehicle(id, request)
