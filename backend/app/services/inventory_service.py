from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.database.models import Vehicle
from app.schemas.inventory import PurchaseRequest, PurchaseResponse, RestockRequest
from app.schemas.vehicle import VehicleResponse


class InventoryService:
    def __init__(self, db: Session):
        self.db = db

    def purchase_vehicle(
        self, vehicle_id: int, request: PurchaseRequest
    ) -> PurchaseResponse:
        """Atomically purchase vehicle quantity using row-level locking for concurrency safety."""
        # Row-level lock: SELECT FOR UPDATE
        stmt = select(Vehicle).where(Vehicle.id == vehicle_id).with_for_update()
        vehicle = self.db.execute(stmt).scalar_one_or_none()

        if not vehicle:
            raise AppException(
                status_code=404,
                code="VEHICLE_NOT_FOUND",
                message=f"Vehicle with ID {vehicle_id} was not found.",
            )

        if vehicle.quantity < request.quantity:
            raise AppException(
                status_code=409,
                code="INSUFFICIENT_STOCK",
                message=f"Requested quantity ({request.quantity}) exceeds available stock ({vehicle.quantity}).",
            )

        # Deduct quantity atomically
        vehicle.quantity -= request.quantity
        self.db.commit()

        return PurchaseResponse(
            message="Purchase successful",
            vehicle_id=vehicle.id,
            purchased_quantity=request.quantity,
            remaining_quantity=vehicle.quantity,
        )

    def restock_vehicle(
        self, vehicle_id: int, request: RestockRequest
    ) -> VehicleResponse:
        """Admin restock endpoint to increase vehicle inventory stock."""
        stmt = select(Vehicle).where(Vehicle.id == vehicle_id).with_for_update()
        vehicle = self.db.execute(stmt).scalar_one_or_none()

        if not vehicle:
            raise AppException(
                status_code=404,
                code="VEHICLE_NOT_FOUND",
                message=f"Vehicle with ID {vehicle_id} was not found.",
            )

        vehicle.quantity += request.quantity
        self.db.commit()
        self.db.refresh(vehicle)

        return VehicleResponse.model_validate(vehicle)
