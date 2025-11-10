from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional  
from database import get_db
from models.user import User
from utils.auth import get_password_hash, verify_password, create_access_token
from utils.logger import logger

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserRegister, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for user: {user.username}")
    
    # Check if user exists by username
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        logger.warning(f"Registration failed - username already exists: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    user_email = user.email if user.email and user.email.strip() else None
    
    if user_email:
        email_user = db.query(User).filter(User.email == user_email).first()
        if email_user:
            logger.warning(f"Registration failed - email already exists: {user_email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user_email,  
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create token
    access_token = create_access_token(data={"sub": user.username})
    logger.info(f"User registered successfully: {user.username}")
    
    return {"access_token": access_token, "token_type": "bearer"}
    # logger.info(f"Registration attempt for user: {user.username}"
    # # Check if user exists
    # db_user = db.query(User).filter(User.username == user.username).first()
    # if db_user:
    #     logger.warning(f"Registration failed - username already exists: {user.username}")
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Username already registered"
    #     )
    
    # # Create new user
    # hashed_password = get_password_hash(user.password)
    # db_user = User(
    #     username=user.username,
    #     email=user.email,
    #     hashed_password=hashed_password
    # )
    # db.add(db_user)
    # db.commit()
    # db.refresh(db_user)
    
    # # Create token
    # access_token = create_access_token(data={"sub": user.username})
    # logger.info(f"User registered successfully: {user.username}")
    
    # return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for user: {user.username}")
    
    # Find user
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        logger.warning(f"Login failed - user not found: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Explicit conversion to string
    hashed_password_str = str(db_user.hashed_password)
    if not verify_password(user.password, hashed_password_str):
        logger.warning(f"Login failed - invalid password for user: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Create token
    access_token = create_access_token(data={"sub": user.username})
    logger.info(f"User logged in successfully: {user.username}")
    
    return {"access_token": access_token, "token_type": "bearer"}