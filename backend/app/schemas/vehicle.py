from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: Decimal = Field(gt=0, description="Price must be greater than zero")
    quantity: int = Field(ge=0, description="Quantity must be zero or greater")

    year: int | None = Field(default=None, ge=1900, le=2100)
    color: str | None = None
    image_url: str | None = None
    description: str | None = None

    @field_validator("make", "model", "category")
    def validate_non_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or contain only whitespace.")
        return stripped


class VehicleCreateRequest(VehicleBase):
    pass


class VehicleUpdateRequest(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedVehicleResponse(BaseModel):
    items: list[VehicleResponse]
    total: int
    page: int
    limit: int
