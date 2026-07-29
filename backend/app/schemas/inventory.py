from pydantic import BaseModel, Field


class PurchaseRequest(BaseModel):
    quantity: int = Field(
        default=1, ge=1, description="Quantity to purchase (must be at least 1)"
    )


class PurchaseResponse(BaseModel):
    message: str
    vehicle_id: int
    purchased_quantity: int
    remaining_quantity: int


class RestockRequest(BaseModel):
    quantity: int = Field(
        ge=1, description="Restock quantity (must be greater than zero)"
    )
