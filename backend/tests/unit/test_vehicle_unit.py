from decimal import Decimal
from unittest.mock import patch

from app.database.models import Vehicle
from app.scripts.seed_vehicles import seed_sample_vehicles


def test_vehicle_repr():
    v = Vehicle(
        id=1, make="Toyota", model="Camry", price=Decimal("28000.00"), quantity=5
    )
    assert (
        repr(v)
        == "<Vehicle(id=1, make='Toyota', model='Camry', price=28000.00, quantity=5)>"
    )


def test_seed_vehicles_script_execution(db_session):
    with patch("app.scripts.seed_vehicles.SessionLocal", return_value=db_session):
        seed_sample_vehicles()

    vehicles = db_session.query(Vehicle).all()
    assert len(vehicles) >= 5
