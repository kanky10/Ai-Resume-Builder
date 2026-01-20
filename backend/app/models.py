from sqlalchemy import Column, Integer, String, Text
from app.db import Base

# ------------------------
# Resume model
# ------------------------
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    skills = Column(Text)
    experience = Column(Text)

# ------------------------
# User model (AUTH)
# ------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)