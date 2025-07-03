from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from ..db.database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.utils.utils import generate_uuid

class User(Base):
    __tablename__ = "users"
    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    token = relationship("Token", back_populates="user", uselist=False)
    data = relationship("Data", back_populates="user", uselist=True)

