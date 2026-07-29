from app.database.session import get_db


def test_get_db_yields_session():
    db_gen = get_db()
    session = next(db_gen)
    assert session is not None
    # Cleanup generator
    try:
        next(db_gen)
    except StopIteration:
        pass
