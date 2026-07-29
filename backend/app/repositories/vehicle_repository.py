from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import Vehicle
from app.schemas.vehicle import VehicleCreateRequest, VehicleUpdateRequest


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, request: VehicleCreateRequest) -> Vehicle:
        vehicle = Vehicle(
            make=request.make,
            model=request.model,
            category=request.category,
            price=request.price,
            quantity=request.quantity,
            year=request.year,
            color=request.color,
            image_url=request.image_url,
            description=request.description,
        )
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def get_by_id(self, vehicle_id: int) -> Vehicle | None:
        return self.db.get(Vehicle, vehicle_id)

    def get_all(self, page: int = 1, limit: int = 20) -> tuple[list[Vehicle], int]:
        offset = (page - 1) * limit
        total_stmt = select(func.count(Vehicle.id))
        total = self.db.execute(total_stmt).scalar() or 0

        query = select(Vehicle).order_by(Vehicle.id.desc()).offset(offset).limit(limit)
        vehicles = list(self.db.execute(query).scalars().all())
        return vehicles, total

    def search(
        self,
        make: str | None = None,
        model: str | None = None,
        category: str | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        page: int = 1,
        limit: int = 20,
    ) -> tuple[list[Vehicle], int]:
        query = select(Vehicle)

        if make and make.strip():
            query = query.where(Vehicle.make.ilike(f"%{make.strip()}%"))
        if model and model.strip():
            query = query.where(Vehicle.model.ilike(f"%{model.strip()}%"))
        if category and category.strip():
            query = query.where(Vehicle.category.ilike(f"%{category.strip()}%"))
        if min_price is not None:
            query = query.where(Vehicle.price >= min_price)
        if max_price is not None:
            query = query.where(Vehicle.price <= max_price)

        total_stmt = select(func.count()).select_from(query.subquery())
        total = self.db.execute(total_stmt).scalar() or 0

        offset = (page - 1) * limit
        query = query.order_by(Vehicle.id.desc()).offset(offset).limit(limit)
        vehicles = list(self.db.execute(query).scalars().all())
        return vehicles, total

    def update(self, vehicle: Vehicle, request: VehicleUpdateRequest) -> Vehicle:
        vehicle.make = request.make
        vehicle.model = request.model
        vehicle.category = request.category
        vehicle.price = request.price
        vehicle.quantity = request.quantity
        vehicle.year = request.year
        vehicle.color = request.color
        vehicle.image_url = request.image_url
        vehicle.description = request.description

        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        self.db.delete(vehicle)
        self.db.commit()
