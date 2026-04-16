from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv

# Import core components
from memory.state_manager import StateManager
from agents.input_agent import InputAgent
from agents.classification_agent import ClassificationAgent
from agents.priority_agent import PriorityAgent
from agents.matching_agent import MatchingAgent
from agents.controller_agent import ControllerAgent

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AidFlow API",
    description="Backend service for the Agentic Volunteer Intelligence System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    """Root endpoint for status verification."""
    return {
        "status": "online",
        "service": "AidFlow Agentic Pipeline",
        "mock_mode": os.getenv("MOCK_API", "False").lower() in ("true", "1", "yes")
    }

@app.post("/process")
async def process_situation(request: ProcessRequest):
    """
    Orchestrates the agent pipeline for a given situation description.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")

    # Initialize State
    state_manager = StateManager()
    state_manager.update({"raw_input": request.text})

    try:
        # Step 1: Input Agent Pipeline
        input_results = InputAgent().process(request.text)
        state_manager.update(input_results)

        # Step 2: Classification Agent
        class_results = ClassificationAgent().process(state_manager.get_context())
        state_manager.update(class_results)

        # Step 3: Priority Agent
        priority_results = PriorityAgent().process(state_manager.get_context())
        state_manager.update(priority_results)

        # Step 4: Matching Agent
        match_results = MatchingAgent().process(state_manager.get_context())
        state_manager.update(match_results)

        # Step 5: Controller Agent (Final Polish)
        final_results = ControllerAgent().process(state_manager.get_context())
        state_manager.update(final_results)

        # Return final state (Always valid JSON)
        return state_manager.state

    except Exception as e:
        print(f"[API Error]: {e}")
        return {
            "error": "Pipeline Failure",
            "detail": str(e),
            "partial_state": state_manager.state
        }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mock_api": os.getenv("MOCK_API", "False")}

if __name__ == "__main__":
    import uvicorn
    import os
    # Use environment variable for PORT, fallback to 8080 for Cloud Run standard
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
