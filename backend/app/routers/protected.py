from fastapi import APIRouter, Depends, HTTPException, status, Header
from utils.auth import verify_token
from utils.logger import logger

router = APIRouter()

async def get_token(authorization: str = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        logger.warning("No Bearer token provided")
        return None
    return authorization.split(" ")[1]

def get_current_user(token: str = Depends(get_token)):
    if token is None:
        logger.warning("Protected route access without token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = verify_token(token)
    if payload is None:
        logger.warning("Protected route access with invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    username = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    logger.info(f"Protected route accessed by user: {username}")
    return {"username": username}

@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You have accessed a protected route!",
        "user": current_user["username"],
        "status": "success"
    }