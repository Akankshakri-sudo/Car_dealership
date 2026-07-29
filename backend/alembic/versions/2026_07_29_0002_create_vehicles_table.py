"""create_vehicles_table

Revision ID: 2026_07_29_0002
Revises: 2026_07_29_0001
Create Date: 2026-07-29 10:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2026_07_29_0002'
down_revision: Union[str, None] = '2026_07_29_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'vehicles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('make', sa.String(length=100), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.CheckConstraint('price > 0', name='check_vehicle_price_positive'),
        sa.CheckConstraint('quantity >= 0', name='check_vehicle_quantity_non_negative'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vehicles_id'), 'vehicles', ['id'], unique=False)
    op.create_index(op.f('ix_vehicles_make'), 'vehicles', ['make'], unique=False)
    op.create_index(op.f('ix_vehicles_model'), 'vehicles', ['model'], unique=False)
    op.create_index(op.f('ix_vehicles_category'), 'vehicles', ['category'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_vehicles_category'), table_name='vehicles')
    op.drop_index(op.f('ix_vehicles_model'), table_name='vehicles')
    op.drop_index(op.f('ix_vehicles_make'), table_name='vehicles')
    op.drop_index(op.f('ix_vehicles_id'), table_name='vehicles')
    op.drop_table('vehicles')
