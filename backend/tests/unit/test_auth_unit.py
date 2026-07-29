import pytest

from app.api.dependencies import require_admin
from app.core.exceptions import AppException
from app.database.models import User


def test_require_admin_allows_admin_user():
    admin_user = User(id=1, full_name="Admin", email="admin@test.com", role="admin")
    result = require_admin(admin_user)
    assert result == admin_user


def test_require_admin_rejects_customer_user():
    customer_user = User(
        id=2, full_name="Customer", email="cust@test.com", role="customer"
    )
    with pytest.raises(AppException) as exc_info:
        require_admin(customer_user)

    assert exc_info.value.status_code == 403
    assert exc_info.value.code == "FORBIDDEN_ADMIN_REQUIRED"
