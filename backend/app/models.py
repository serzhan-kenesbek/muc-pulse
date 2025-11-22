from sqlalchemy import Column, Integer, Boolean, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base


class Request(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(TIMESTAMP, server_default=func.now())
    latitude = Column(Numeric(precision=10, scale=6))
    longitude = Column(Numeric(precision=10, scale=6))

    is_safe = Column(Boolean, default=None)
    is_clean = Column(Boolean, default=None)
    is_accessible = Column(Boolean, default=None)
    is_quiet = Column(Boolean, default=None)
    is_uncrowded = Column(Boolean, default=None)
    is_lively = Column(Boolean, default=None)
