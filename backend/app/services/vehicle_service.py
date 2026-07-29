from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import (
    PaginatedVehicleResponse,
    VehicleCreateRequest,
    VehicleResponse,
    VehicleUpdateRequest,
)


class VehicleService:
    def __init__(self, db: Session):
        self.vehicle_repo = VehicleRepository(db)

    def create_vehicle(self, request: VehicleCreateRequest) -> VehicleResponse:
        vehicle = self.vehicle_repo.create(request)
        return VehicleResponse.model_validate(vehicle)

    def get_vehicle_by_id(self, vehicle_id: int) -> VehicleResponse:
        vehicle = self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise AppException(
                status_code=404,
                code="VEHICLE_NOT_FOUND",
                message=f"Vehicle with ID {vehicle_id} was not found.",
            )
        return VehicleResponse.model_validate(vehicle)

    def list_vehicles(self, page: int = 1, limit: int = 20) -> PaginatedVehicleResponse:
        vehicles, total = self.vehicle_repo.get_all(page=page, limit=limit)
        items = [VehicleResponse.model_validate(v) for v in vehicles]
        return PaginatedVehicleResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
        )

    def search_vehicles(
        self,
        make: str | None = None,
        model: str | None = None,
        category: str | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        page: int = 1,
        limit: int = 20,
    ) -> list[VehicleResponse]:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise AppException(
                status_code=422,
                code="INVALID_PRICE_RANGE",
                message="Minimum price cannot be greater than maximum price.",
            )

        vehicles, _ = self.vehicle_repo.search(
            make=make,
            model=model,
            category=category,
            min_price=min_price,
            max_price=max_price,
            page=page,
            limit=limit,
        )
        return [VehicleResponse.model_validate(v) for v in vehicles]

    def update_vehicle(
        self, vehicle_id: int, request: VehicleUpdateRequest
    ) -> VehicleResponse:
        vehicle = self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise AppException(
                status_code=404,
                code="VEHICLE_NOT_FOUND",
                message=f"Vehicle with ID {vehicle_id} was not found.",
            )

        updated_vehicle = self.vehicle_repo.update(vehicle, request)
        return VehicleResponse.model_validate(updated_vehicle)

    def delete_vehicle(self, vehicle_id: int) -> None:
        vehicle = self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise AppException(
                status_code=404,
                code="VEHICLE_NOT_FOUND",
                message=f"Vehicle with ID {vehicle_id} was not found.",
            )
        self.vehicle_repo.delete(vehicle)
