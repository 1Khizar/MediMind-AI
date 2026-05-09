# MediMind AI Backend - Core Intelligence

The backbone of the MediMind AI ecosystem, this FastAPI server manages the AI agent, authentication, and database persistence.

## 🧠 Core Technologies
- **FastAPI**: High-performance Python web framework.
- **LangChain & LangGraph**: Orchestration of the agentic AI workflow.
- **SQLAlchemy**: ORM for PostgreSQL database management.
- **Pydantic**: Data validation and serialization.
- **UV**: Modern Python package management.

## 🚀 Key Endpoints
- `POST /api/v1/auth/register`: User registration.
- `POST /api/v1/auth/login`: JWT-based authentication.
- `POST /api/v1/chat`: Non-streaming consultation logic.
- `POST /api/v1/chat/stream`: Real-time SSE streaming for AI responses.
- `GET /api/v1/history`: Retrieve personalized consultation threads.

## 🛠️ Setup Instructions

### Environment Configuration
1. Copy the `.env.example` to `.env`.
2. Fill in the required API keys:
   - `GROQ_API_KEY`: For LLM processing.
   - `SERPER_API_KEY`: For real-time medical search.
   - `DATABASE_URL`: PostgreSQL connection string (Neon DB).

### Installation
```bash
# Using uv (fastest)
uv sync

# Activate environment
.\.venv\Scripts\activate
```

### Running the Server
```bash
python -m main_api
```

## 📂 Project Structure
- `/agents`: LangGraph logic and custom search tools.
- `/api`: Routes, schemas, and authentication logic.
- `/db`: Database models and session management.
- `/config`: Centralized application configuration.