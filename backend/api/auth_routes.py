from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from db.base import get_db
from db.models import User
from api.auth import get_password_hash, verify_password, create_access_token, get_current_user
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., max_length=72)

class Token(BaseModel):
    access_token: str
    token_type: str

class LiveKitTokenResponse(BaseModel):
    token: str
    room: str

router = APIRouter()

import os
from livekit.api import AccessToken, VideoGrants

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "username": new_user.username}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/livekit-token", response_model=LiveKitTokenResponse)
def get_livekit_token(current_user: User = Depends(get_current_user)):
    """Generate a token for the user to securely connect to the LiveKit voice room."""
    # Ensure keys are loaded
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    
    if not api_key or not api_secret:
        raise HTTPException(status_code=500, detail="LiveKit keys are not configured correctly.")
        
    # The room name can be the user's ID so their consultation is private
    room_name = f"consultation_{current_user.id}"
    
    grant = VideoGrants(room_join=True, room=room_name)
    token = AccessToken(api_key, api_secret).with_identity(str(current_user.id)).with_name(current_user.username).with_grants(grant)
    
    return {"token": token.to_jwt(), "room": room_name}
