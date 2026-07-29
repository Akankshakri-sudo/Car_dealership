from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.database.models import User, Vehicle


def create_test_user(db_session: Session, email: str, role: str = "customer") -> User:
    user = User(
        full_name="Test User",
        email=email,
        password_hash="hashed_pwd",
        role=role,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def create_test_vehicle(
    db_session: Session, make: str = "Toyota", quantity: int = 5
) -> Vehicle:
    v = Vehicle(
        make=make,
        model="Camry",
        category="Sedan",
        price=28500.00,
        quantity=quantity,
    )
    db_session.add(v)
    db_session.commit()
    db_session.refresh(v)
    return v


def get_auth_headers(user: User) -> dict[str, str]:
    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return {"Authorization": f"Bearer {token}"}


def test_customer_can_purchase_in_stock_vehicle(
    client: TestClient, db_session: Session
):
    customer = create_test_user(db_session, "cust_purch@test.com", role="customer")
    vehicle = create_test_vehicle(db_session, quantity=5)
    headers = get_auth_headers(customer)

    # Purchase 2 units
    response = client.post(
        f"/api/vehicles/{vehicle.id}/purchase", json={"quantity": 2}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["purchased_quantity"] == 2
    assert data["remaining_quantity"] == 3

    # Check vehicle stock in database
    db_session.refresh(vehicle)
    assert vehicle.quantity == 3


def test_purchase_fails_when_quantity_exceeds_stock(
    client: TestClient, db_session: Session
):
    customer = create_test_user(db_session, "cust_exceed@test.com", role="customer")
    vehicle = create_test_vehicle(db_session, quantity=1)
    headers = get_auth_headers(customer)

    # Request 2 units when only 1 is in stock
    response = client.post(
        f"/api/vehicles/{vehicle.id}/purchase", json={"quantity": 2}, headers=headers
    )
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "INSUFFICIENT_STOCK"

    # Verify stock remains unchanged
    db_session.refresh(vehicle)
    assert vehicle.quantity == 1


def test_purchase_fails_when_out_of_stock(client: TestClient, db_session: Session):
    customer = create_test_user(db_session, "cust_zero@test.com", role="customer")
    vehicle = create_test_vehicle(db_session, quantity=0)
    headers = get_auth_headers(customer)

    response = client.post(
        f"/api/vehicles/{vehicle.id}/purchase", json={"quantity": 1}, headers=headers
    )
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "INSUFFICIENT_STOCK"


def test_purchase_invalid_quantity_rejected(client: TestClient, db_session: Session):
    customer = create_test_user(db_session, "cust_inv_qty@test.com", role="customer")
    vehicle = create_test_vehicle(db_session, quantity=5)
    headers = get_auth_headers(customer)

    # Quantity 0
    res1 = client.post(
        f"/api/vehicles/{vehicle.id}/purchase", json={"quantity": 0}, headers=headers
    )
    assert res1.status_code == 422

    # Negative quantity
    res2 = client.post(
        f"/api/vehicles/{vehicle.id}/purchase", json={"quantity": -2}, headers=headers
    )
    assert res2.status_code == 422


def test_admin_can_restock_vehicle(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_restock@test.com", role="admin")
    vehicle = create_test_vehicle(db_session, quantity=2)
    headers = get_auth_headers(admin)

    response = client.post(
        f"/api/vehicles/{vehicle.id}/restock", json={"quantity": 10}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 12

    db_session.refresh(vehicle)
    assert vehicle.quantity == 12


def test_customer_cannot_restock_vehicle(client: TestClient, db_session: Session):
    customer = create_test_user(db_session, "cust_restock@test.com", role="customer")
    vehicle = create_test_vehicle(db_session, quantity=2)
    headers = get_auth_headers(customer)

    response = client.post(
        f"/api/vehicles/{vehicle.id}/restock", json={"quantity": 5}, headers=headers
    )
    assert response.status_code == 403


def test_restock_invalid_quantity_rejected(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_restock_val@test.com", role="admin")
    vehicle = create_test_vehicle(db_session, quantity=2)
    headers = get_auth_headers(admin)

    # Quantity 0
    res1 = client.post(
        f"/api/vehicles/{vehicle.id}/restock", json={"quantity": 0}, headers=headers
    )
    assert res1.status_code == 422

    # Missing vehicle returns 404
    res2 = client.post(
        "/api/vehicles/99999/restock", json={"quantity": 5}, headers=headers
    )
    assert res2.status_code == 404
