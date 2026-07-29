from decimal import Decimal

from app.database.session import SessionLocal
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import VehicleCreateRequest

SAMPLE_VEHICLES = [
    {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": Decimal("28500.00"),
        "quantity": 5,
        "year": 2024,
        "color": "Midnight Black",
        "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
        "description": "Reliable executive sedan with hybrid capability and advanced safety suite.",
    },
    {
        "make": "Honda",
        "model": "CR-V",
        "category": "SUV",
        "price": Decimal("34200.00"),
        "quantity": 3,
        "year": 2024,
        "color": "Sonic Gray Pearl",
        "image_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
        "description": "Spacious family crossover featuring all-wheel drive and leather interior.",
    },
    {
        "make": "Ford",
        "model": "Mustang GT",
        "category": "Coupe",
        "price": Decimal("52000.00"),
        "quantity": 2,
        "year": 2023,
        "color": "Race Red",
        "image_url": "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
        "description": "Iconic American muscle car with a 5.0L V8 engine and active valve exhaust.",
    },
    {
        "make": "Tesla",
        "model": "Model Y",
        "category": "Electric",
        "price": Decimal("48990.00"),
        "quantity": 0,  # Out of stock example
        "year": 2024,
        "color": "Pearl White",
        "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
        "description": "Long Range All-Wheel Drive electric SUV with autopilot capabilities.",
    },
    {
        "make": "BMW",
        "model": "M3 Competition",
        "category": "Sedan",
        "price": Decimal("76000.00"),
        "quantity": 1,
        "year": 2024,
        "color": "Isle of Man Green",
        "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
        "description": "High-performance sports sedan with twin-turbo inline 6 engine.",
    },
]


def seed_sample_vehicles():
    """CLI script to populate sample vehicle inventory."""
    db = SessionLocal()
    try:
        vehicle_repo = VehicleRepository(db)
        count = 0
        for data in SAMPLE_VEHICLES:
            req = VehicleCreateRequest(**data)
            vehicle_repo.create(req)
            count += 1
        print(f"Successfully seeded {count} sample vehicles into dealership inventory!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_sample_vehicles()
