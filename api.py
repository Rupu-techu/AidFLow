from fastapi import FastAPI, HTTPException
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

class ProcessRequest(BaseModel):
    text: str

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

        # Return final state
        return state_manager.state

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline Error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mock_api": os.getenv("MOCK_API", "False")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
