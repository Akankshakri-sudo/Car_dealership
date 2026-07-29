from sqlalchemy import text
from sqlalchemy.orm import Session


def test_database_session_executes_query(db_session: Session):
    result = db_session.execute(text("SELECT 1")).scalar()
    assert result == 1
