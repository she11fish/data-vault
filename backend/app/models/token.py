from sqlalchemy import Column, String, ForeignKey, DateTime, func
from app.db.database import Base
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.utils.utils import generate_uuid

class Token(Base):
    __tablename__ = "token"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id = Column(String, primary_key=True, default=generate_uuid)
    hashed_token = Column(String, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    # user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    user = relationship("User", back_populates="token")