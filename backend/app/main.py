from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.db import Base, engine

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Builder API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/")
def root():
    return {"message": "Backend is running"}