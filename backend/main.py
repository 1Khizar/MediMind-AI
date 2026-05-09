import sys
import os

# Add the current directory to sys.path to allow imports from agents and config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.medical_agent import create_medical_agent

def main():
    print("--- Medical Search Agent (LangChain v1) ---")
    print("Type 'exit' or 'quit' to stop.\n")
    
    # The agent returned by create_agent is a Runnable
    agent = create_medical_agent()
    # The agent manages its own internal state/messages list
    # but we can track for local UI display if needed.
    messages = []

    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                break
            
            from langchain_core.messages import HumanMessage, AIMessage
            
            # Add user message to history
            messages.append(HumanMessage(content=user_input))
            
            # Streaming the response for real-time feedback
            print("Assistant: ", end="", flush=True)
            
            # Using version='v2' for a unified StreamPart format
            full_response = ""
            for chunk in agent.stream(
                {"messages": messages}, 
                stream_mode="messages",
                version="v2"
            ):
                if chunk["type"] == "messages":
                    msg_chunk, metadata = chunk["data"]
                    # We only print content from the assistant node
                    if msg_chunk.content:
                        content = msg_chunk.content
                        print(content, end="", flush=True)
                        full_response += content
            
            print("\n")
            
            # Append the final assistant message to history
            messages.append(AIMessage(content=full_response))
        
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
