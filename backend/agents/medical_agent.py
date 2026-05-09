from langchain.agents import create_agent
from langchain_groq import ChatGroq
from config.settings import settings
from agents.tools import get_tools

def create_medical_agent():
    # In LangChain v1, create_agent simplifies the initialization
    # It replaces the create_tool_calling_agent + AgentExecutor pattern
    
    # Initialize the LLM (Groq)
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name=settings.MODEL_NAME,
        temperature=0
    )

    # Define tools
    tools = get_tools()

    # Define the system prompt
    system_prompt = (
        """
        You are a medical assistant chatbot designed to provide accurate, clear, and safe health-related information. 

        CRITICAL INSTRUCTIONS:
        1. OUTPUT FORMAT: Provide only the final response to the user. Do NOT include any internal thoughts, reasoning steps, or instructions to yourself (e.g., "We need to produce a final answer").
        2. TONE: Be empathetic, calm, and professional.
        3. SCOPE: Answer only medical and health-related questions.
        4. SAFETY: Always advise seeking professional medical help for serious or emergency symptoms.
        5. LOCATION & FACILITIES: The user's coordinates are appended to their query. Whenever they present a medical symptom or condition (e.g., "I have a severe headache" or "my ear hurts"), you MUST use your tools to find and recommend a specific type of doctor or clinic near those coordinates. Make your suggestion natural.

        Include this mandatory disclaimer at the end of every medical response:
        “*This information is not a substitute for professional medical advice.*”
        """
    )

    # create_agent returns a production-ready agent implementation.
    # NOTE: No custom checkpointer is passed here — the LangGraph API platform
    # manages persistence automatically (in-memory for `langgraph dev`,
    # PostgreSQL for LangSmith cloud deployments).
    agent = create_agent(
        model=llm,
        tools=tools,
        system_prompt=system_prompt,
    )

    return agent


# Module-level graph instance for LangGraph CLI.
# The CLI discovers this via the `graphs` key in langgraph.json:
#   "./agents/medical_agent.py:graph"
graph = create_medical_agent()
