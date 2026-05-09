from db.base import engine, Base
from db.models import User, ChatSession, ChatMessage

print("Dropping all tables...")
# Re-import models to ensure they are registered with Base
Base.metadata.drop_all(bind=engine)
print("Creating all tables from scratch...")
Base.metadata.create_all(bind=engine)
print("Database reset successful.")
