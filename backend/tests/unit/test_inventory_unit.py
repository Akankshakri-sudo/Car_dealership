import pytest

from app.core.exceptions import AppException
from app.schemas.inventory import PurchaseRequest
from app.services.inventory_service import InventoryService


def test_purchase_missing_vehicle_raises_404(db_session):
    service = InventoryService(db_session)
    req = PurchaseRequest(quantity=1)

    with pytest.raises(AppException) as exc:
        service.purchase_vehicle(vehicle_id=99999, request=req)

    assert exc.value.status_code == 404
    assert exc.value.code == "VEHICLE_NOT_FOUND"
