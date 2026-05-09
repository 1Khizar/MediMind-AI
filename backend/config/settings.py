import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    SERPER_API_KEY = os.getenv("SERPER_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME", "openai/gpt-oss-120b")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/medical_chatbot")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-for-jwt-change-me")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()
