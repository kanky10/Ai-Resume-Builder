from pydantic import BaseModel

class ResumeCreate(BaseModel):
    name: str
    email: str
    skills: str
    experience: str

class ResumeResponse(ResumeCreate):
    id: int