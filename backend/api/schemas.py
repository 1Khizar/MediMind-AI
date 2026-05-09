from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatMessageBase(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None # Optional for starting a new session

class ChatResponse(BaseModel):
    response: str
    session_id: str
    history: List[ChatMessageBase]
