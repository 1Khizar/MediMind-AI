from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as chat_router
from api.auth_routes import router as auth_router
from db.base import engine, Base
import uvicorn

# Create Database tables on startup
Base.metadata.create_all(bind=engine)

# The FastAPI app is mounted by the LangGraph CLI via `http.app` in langgraph.json.
# We also add CORS here so it works natively with uvicorn.
app = FastAPI(title="Medical Search Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Chat Routes
app.include_router(chat_router, prefix="/api/v1", tags=["chat"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Medical API is running"}

if __name__ == "__main__":
    uvicorn.run("main_api:app", host="0.0.0.0", port=8000, reload=True)
