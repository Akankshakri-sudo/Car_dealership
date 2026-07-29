from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.database.models import User


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


def get_auth_headers(user: User) -> dict[str, str]:
    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return {"Authorization": f"Bearer {token}"}


def test_admin_can_add_vehicle(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_add@test.com", role="admin")
    headers = get_auth_headers(admin)

    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 28500.00,
        "quantity": 5,
        "year": 2024,
        "color": "Midnight Black",
        "image_url": "https://example.com/camry.jpg",
        "description": "Reliable sedan.",
    }

    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert float(data["price"]) == 28500.00
    assert data["quantity"] == 5


def test_customer_cannot_add_vehicle(client: TestClient, db_session: Session):
    customer = create_test_user(db_session, "cust_add@test.com", role="customer")
    headers = get_auth_headers(customer)

    payload = {
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 25000.00,
        "quantity": 3,
    }

    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 403


def test_unauthenticated_cannot_add_vehicle(client: TestClient):
    payload = {
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 25000.00,
        "quantity": 3,
    }
    response = client.post("/api/vehicles", json=payload)
    assert response.status_code == 401


def test_invalid_vehicle_payload_rejected(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_val@test.com", role="admin")
    headers = get_auth_headers(admin)

    # Empty make string
    res1 = client.post(
        "/api/vehicles",
        json={
            "make": "   ",
            "model": "Civic",
            "category": "Sedan",
            "price": 25000.00,
            "quantity": 3,
        },
        headers=headers,
    )
    assert res1.status_code == 422

    # Negative price
    res2 = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": -100.00,
            "quantity": 3,
        },
        headers=headers,
    )
    assert res2.status_code == 422

    # Negative quantity
    res3 = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 25000.00,
            "quantity": -5,
        },
        headers=headers,
    )
    assert res3.status_code == 422


def test_list_vehicles_includes_out_of_stock(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_list@test.com", role="admin")
    cust = create_test_user(db_session, "cust_list@test.com", role="customer")
    admin_headers = get_auth_headers(admin)
    cust_headers = get_auth_headers(cust)

    # Add in-stock and out-of-stock vehicles
    client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "RAV4",
            "category": "SUV",
            "price": 32000.0,
            "quantity": 2,
        },
        headers=admin_headers,
    )
    client.post(
        "/api/vehicles",
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Coupe",
            "price": 45000.0,
            "quantity": 0,
        },
        headers=admin_headers,
    )

    # Customer lists vehicles
    response = client.get("/api/vehicles", headers=cust_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    items = data["items"]
    # Check that out of stock vehicle (quantity=0) is included
    quantities = [item["quantity"] for item in items]
    assert 0 in quantities
    assert 2 in quantities


def test_search_vehicles_multi_filter_and_case_insensitive(
    client: TestClient, db_session: Session
):
    admin = create_test_user(db_session, "admin_src@test.com", role="admin")
    cust = create_test_user(db_session, "cust_src@test.com", role="customer")
    admin_headers = get_auth_headers(admin)
    cust_headers = get_auth_headers(cust)

    client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Highlander",
            "category": "SUV",
            "price": 42000.0,
            "quantity": 3,
        },
        headers=admin_headers,
    )
    client.post(
        "/api/vehicles",
        json={
            "make": "BMW",
            "model": "X5",
            "category": "SUV",
            "price": 65000.0,
            "quantity": 1,
        },
        headers=admin_headers,
    )
    client.post(
        "/api/vehicles",
        json={
            "make": "toyota",
            "model": "corolla",
            "category": "Sedan",
            "price": 22000.0,
            "quantity": 4,
        },
        headers=admin_headers,
    )

    # Search case insensitive make=TOYOTA & category=SUV
    res1 = client.get(
        "/api/vehicles/search?make=TOYOTA&category=SUV", headers=cust_headers
    )
    assert res1.status_code == 200
    items1 = res1.json()
    assert len(items1) == 1
    assert items1[0]["model"] == "Highlander"

    # Search price range min_price=30000 & max_price=50000
    res2 = client.get(
        "/api/vehicles/search?min_price=30000&max_price=50000", headers=cust_headers
    )
    assert res2.status_code == 200
    items2 = res2.json()
    assert len(items2) == 1
    assert items2[0]["make"] == "Toyota"

    # No match returns empty list
    res3 = client.get("/api/vehicles/search?make=NonExistent", headers=cust_headers)
    assert res3.status_code == 200
    assert res3.json() == []

    # Invalid price range (min > max) returns 422
    res4 = client.get(
        "/api/vehicles/search?min_price=50000&max_price=20000", headers=cust_headers
    )
    assert res4.status_code == 422
    assert res4.json()["error"]["code"] == "INVALID_PRICE_RANGE"


def test_update_vehicle_admin_and_not_found(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_upd@test.com", role="admin")
    cust = create_test_user(db_session, "cust_upd@test.com", role="customer")
    admin_headers = get_auth_headers(admin)
    cust_headers = get_auth_headers(cust)

    res_add = client.post(
        "/api/vehicles",
        json={
            "make": "Tesla",
            "model": "Model 3",
            "category": "Sedan",
            "price": 40000.0,
            "quantity": 2,
        },
        headers=admin_headers,
    )
    vehicle_id = res_add.json()["id"]

    # Customer cannot update
    res_cust = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={
            "make": "Tesla",
            "model": "Model 3",
            "category": "Sedan",
            "price": 38000.0,
            "quantity": 5,
        },
        headers=cust_headers,
    )
    assert res_cust.status_code == 403

    # Admin updates successfully
    res_admin = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={
            "make": "Tesla",
            "model": "Model 3 Performance",
            "category": "Sedan",
            "price": 45000.0,
            "quantity": 5,
        },
        headers=admin_headers,
    )
    assert res_admin.status_code == 200
    assert res_admin.json()["model"] == "Model 3 Performance"
    assert float(res_admin.json()["price"]) == 45000.0

    # Non-existent ID returns 404
    res_404 = client.put(
        "/api/vehicles/99999",
        json={
            "make": "Tesla",
            "model": "Model X",
            "category": "SUV",
            "price": 80000.0,
            "quantity": 1,
        },
        headers=admin_headers,
    )
    assert res_404.status_code == 404
    assert res_404.json()["error"]["code"] == "VEHICLE_NOT_FOUND"


def test_delete_vehicle_admin_and_not_found(client: TestClient, db_session: Session):
    admin = create_test_user(db_session, "admin_del@test.com", role="admin")
    cust = create_test_user(db_session, "cust_del@test.com", role="customer")
    admin_headers = get_auth_headers(admin)
    cust_headers = get_auth_headers(cust)

    res_add = client.post(
        "/api/vehicles",
        json={
            "make": "Nissan",
            "model": "Altima",
            "category": "Sedan",
            "price": 24000.0,
            "quantity": 1,
        },
        headers=admin_headers,
    )
    vehicle_id = res_add.json()["id"]

    # Customer cannot delete
    res_cust = client.delete(f"/api/vehicles/{vehicle_id}", headers=cust_headers)
    assert res_cust.status_code == 403

    # Admin deletes vehicle
    res_admin = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert res_admin.status_code == 204

    # Getting deleted vehicle returns 404
    res_get = client.get(f"/api/vehicles/{vehicle_id}", headers=cust_headers)
    assert res_get.status_code == 404

    # Deleting missing vehicle returns 404
    res_404 = client.delete("/api/vehicles/99999", headers=admin_headers)
    assert res_404.status_code == 404
