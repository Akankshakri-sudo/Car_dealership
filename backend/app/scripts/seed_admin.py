import getpass
import os
import sys

from app.core.security import get_password_hash
from app.database.session import SessionLocal
from app.repositories.user_repository import UserRepository


def seed_admin_account():
    """CLI script to safely create or update an administrator account."""
    db = SessionLocal()
    try:
        user_repo = UserRepository(db)

        email = os.environ.get("ADMIN_EMAIL")
        if not email:
            email = (
                input("Enter Admin Email [admin@dealership.com]: ").strip()
                or "admin@dealership.com"
            )

        password = os.environ.get("ADMIN_PASSWORD")
        if not password:
            password = getpass.getpass("Enter Admin Password: ").strip()

        if not password or len(password) < 8:
            print("Error: Admin password must be at least 8 characters long.")
            sys.exit(1)

        existing_user = user_repo.get_by_email(email)
        if existing_user:
            print(f"User '{email}' already exists. Updating role to 'admin'...")
            existing_user.role = "admin"
            existing_user.password_hash = get_password_hash(password)
            db.commit()
            print(f"Successfully updated user '{email}' to admin!")
        else:
            hashed_pwd = get_password_hash(password)
            admin = user_repo.create(
                full_name="System Administrator",
                email=email,
                password_hash=hashed_pwd,
                role="admin",
            )
            print(
                f"Successfully seeded Administrator account: {admin.email} (ID: {admin.id})"
            )
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_account()
