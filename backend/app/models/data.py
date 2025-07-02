from sqlalchemy import Column, String, ForeignKey, DateTime
from app.db.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.utils.utils import generate_uuid

class Data(Base):
    __tablename__ = "data"
    # TODO: HANGE it to psql since this supports psql only 
    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    content = Column(String, index=True)
    # user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    user_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)
    user = relationship("User", back_populates="data")