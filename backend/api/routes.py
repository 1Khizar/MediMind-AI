from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from typing import List
import uuid
import json
import logging

_log = logging.getLogger("routes")

from db.base import get_db
from db.models import ChatSession, ChatMessage, User
from api.schemas import ChatRequest, ChatResponse, ChatMessageBase
from agents.medical_agent import create_medical_agent
from api.auth import get_current_user
from langchain_core.messages import HumanMessage

router = APIRouter()
# The agent is created once and its InMemorySaver checkpointer persists
# conversation state per thread_id (= session UUID) across requests.
agent = create_medical_agent()

def get_or_create_session(db: Session, user: User, session_uuid: str = None):
    """Retrieve existing session or create a new one for the specific user."""
    if session_uuid:
        db_session = db.query(ChatSession).filter(
            ChatSession.session_id == session_uuid,
            ChatSession.user_id == user.id
        ).first()
        if db_session:
            return db_session
    
    # Create new session linked to the user
    new_uuid = session_uuid or str(uuid.uuid4())
    db_session = ChatSession(session_id=new_uuid, user_id=user.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Standard non-streaming chat endpoint (Secured)."""
    db_session = get_or_create_session(db, current_user, request.session_id)

    # The agent's InMemorySaver checkpointer tracks conversation history per thread_id.
    # We only send the new user message; the checkpointer restores prior context.
    # Source: https://docs.langchain.com/oss/python/langchain/short-term-memory
    config = {"configurable": {"thread_id": db_session.session_id}}

    # ── Debug: log raw vs enriched query ──────────────────────────────────────
    separator = "-" * 60
    print(f"\n{separator}")
    print(f"[CHAT /chat] user={current_user.id}  session={db_session.session_id}")
    print(f"[CHAT] Received query:\n{request.query}")
    print(f"{separator}\n")
    # ──────────────────────────────────────────────────────────────────────────

    # Run Agent
    try:
        response = agent.invoke(
            {"messages": [{"role": "user", "content": request.query}]},
            config,
        )
        ai_content = response["messages"][-1].content
        
        # Persist to DB for history display and cross-restart recovery
        user_msg = ChatMessage(session_id=db_session.id, role='user', content=request.query)
        ai_msg = ChatMessage(session_id=db_session.id, role='assistant', content=ai_content)
        db.add_all([user_msg, ai_msg])
        db.commit()
        
        # Format history for response
        history_response = [ChatMessageBase(role=m.role, content=m.content, timestamp=m.timestamp) for m in db_session.messages]
        
        return ChatResponse(
            response=ai_content,
            session_id=db_session.session_id,
            history=history_response
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/stream")
def chat_stream(
    request: ChatRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Streaming chat endpoint (Secured)."""
    db_session = get_or_create_session(db, current_user, request.session_id)

    # The agent's InMemorySaver checkpointer tracks conversation history per thread_id.
    # We only send the new user message; the checkpointer restores prior context.
    # Source: https://docs.langchain.com/oss/python/langchain/short-term-memory
    config = {"configurable": {"thread_id": db_session.session_id}}

    # ── Debug: log the query received (includes location block when provided) ──
    separator = "-" * 60
    print(f"\n{separator}")
    print(f"[STREAM /chat/stream] user={current_user.id}  session={db_session.session_id}")
    print(f"[STREAM] Received query:\n{request.query}")
    print(f"{separator}\n")
    # ──────────────────────────────────────────────────────────────────────────

    def event_generator():
        try:
            full_response = ""
            # Persist user message immediately
            user_msg = ChatMessage(session_id=db_session.id, role='user', content=request.query)
            db.add(user_msg)
            db.commit()

            # Stream agent response — checkpointer supplies prior conversation context.
            # Per LangChain streaming docs (oss/python/langchain/streaming):
            # stream_mode="messages" emits chunks from ALL nodes (model + tools).
            # We filter to ONLY forward text tokens from the 'model' node,
            # skipping tool_call_chunks and the 'tools' node entirely.
            # Source: https://docs.langchain.com/oss/python/langchain/streaming
            emitted_tool_call_ids = set()
            for chunk in agent.stream(
                {"messages": [{"role": "user", "content": request.query}]},
                config,
                stream_mode="messages",
                version="v2"
            ):
                if chunk["type"] == "messages":
                    msg_chunk, metadata = chunk["data"]

                    # Detect tool calls - even if we are not on the 'model' node yet in terms of final text,
                    # tool calls usually come from the model node before the tools node executes.
                    if hasattr(msg_chunk, "tool_calls") and msg_chunk.tool_calls:
                        for tc in msg_chunk.tool_calls:
                            tc_id = tc.get('id')
                            if tc_id and tc_id not in emitted_tool_call_ids:
                                emitted_tool_call_ids.add(tc_id)
                                yield f"data: {json.dumps({'tool': tc['name'], 'args': tc['args']})}\n\n"

                    # Only process tokens from the model node for final text response
                    node = metadata.get("langgraph_node", "") 
                    if node != "model":
                        continue

                    # Skip tool_call_chunks from being streamed as 'content' to avoid JSON in chat bubbles
                    if hasattr(msg_chunk, "tool_call_chunks") and msg_chunk.tool_call_chunks:
                        continue

                    # Only emit real text content tokens
                    if msg_chunk.content and isinstance(msg_chunk.content, str):
                        content = msg_chunk.content
                        full_response += content
                        yield f"data: {json.dumps({'content': content})}\n\n"
            
            # Persist AI reply to DB for history display
            ai_msg = ChatMessage(session_id=db_session.id, role='assistant', content=full_response)
            db.add(ai_msg)
            db.commit()
            yield "data: [DONE]\n\n"
        except Exception as e:
            error_msg = str(e)
            if "Authentication" in error_msg or "Invalid API Key" in error_msg:
                yield f"data: {json.dumps({'error': 'The AI model is currently unavailable due to an authentication error. Please check the GROQ_API_KEY configuration.'})}\n\n"
            else:
                yield f"data: {json.dumps({'error': f'An unexpected error occurred: {error_msg}'})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/history", response_model=List[ChatResponse])
def get_user_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all chat history for the authenticated user."""
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).all()
    
    response_data = []
    for session in sessions:
        history = [ChatMessageBase(role=m.role, content=m.content, timestamp=m.timestamp) for m in session.messages]
        last_msg = history[-1].content if history else ""
        response_data.append(ChatResponse(
            response=last_msg,
            session_id=session.session_id,
            history=history
        ))
    
    return response_data
