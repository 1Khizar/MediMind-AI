import asyncio
import os
import logging
from dotenv import load_dotenv

from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from livekit.agents.voice import AgentSession, Agent
from livekit.plugins.google.realtime import RealtimeModel
from livekit.plugins import silero

# Load environment variables from .env
load_dotenv()

logger = logging.getLogger("medic-ai-voice")

SYSTEM_PROMPT = (
    "You are MedicAI, a professional and empathetic medical consultation assistant. "
    "You help users understand their health concerns, symptoms, and general wellness questions. "
    "Keep your spoken responses SHORT, conversational, and friendly — you are talking, not writing. "
    "Do not use bullet points, markdown, or headers — speak naturally. "
    "If symptoms are serious, always recommend the user see a real doctor immediately. "
    "Never diagnose definitively — always clarify you provide general information only."
)


async def entrypoint(ctx: JobContext):
    """Main entry point: connects to the LiveKit room and starts voice conversation."""

    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        logger.error("GOOGLE_API_KEY is not set in .env!")
        return

    logger.info(f"Connecting to room: {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Google Gemini Realtime — this single model handles HEARING + THINKING + SPEAKING
    # No separate STT or TTS needed — it's all in one
    model = RealtimeModel(
        model="gemini-2.0-flash-exp",
        api_key=google_api_key,
        instructions=SYSTEM_PROMPT,
        voice="Puck",  # Natural voice. Other options: Charon, Kore, Fenrir, Aoede
    )

    # AgentSession uses the realtime model directly
    session = AgentSession(model=model)
    agent = Agent(instructions=SYSTEM_PROMPT)

    await session.start(ctx.room, agent=agent)

    # Greet user immediately when they join
    await session.generate_reply(
        instructions="Warmly greet the user as MedicAI and ask them how they are feeling today."
    )

    logger.info("MedicAI Voice Agent greeted — waiting for user to speak.")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
