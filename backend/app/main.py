from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
import os


load_dotenv()

from routers import auth, protected
from database import engine, Base
from models.user import User
from utils.logger import logger

# Create tables
Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(protected.router, prefix="/api", tags=["protected"])

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Todo API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "todo-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)