import json
from config.gemini_client import generate_response
from config.prompts import CONTROLLER_PROMPT
from memory.state_manager import StateManager
from agents.input_agent import InputAgent
from agents.classification_agent import ClassificationAgent
from agents.priority_agent import PriorityAgent
from agents.matching_agent import MatchingAgent

def safe_json(response):
    try:
        start, end = response.find('{'), response.rfind('}')
        cleaned = response[start:end+1] if start != -1 and end != -1 else response
        return json.loads(cleaned)
    except:
        return {"error": "Invalid JSON", "raw": response}

class ControllerAgent:
    def __init__(self, client=None):
        pass

    def process(self, text: str) -> dict:
        try:
            state_manager = StateManager()
            state_manager.update({"raw_input": text})
            
            # Step 1: Input Agent Pipeline
            print("[Thinking] Running Input Agent...")
            state_manager.update(InputAgent().process(text))
            
            # Step 2: Classification Agent
            print("[Thinking] Running Classification Agent...")
            state_manager.update(ClassificationAgent().process(state_manager.get_context()))
            
            # Step 3: Priority Agent
            print("[Thinking] Running Priority Agent...")
            state_manager.update(PriorityAgent().process(state_manager.get_context()))
            
            # Step 4: Matching Agent
            print("[Thinking] Running Matching Agent...")
            state_manager.update(MatchingAgent().process(state_manager.get_context()))
            
            # Step 5: Controller Agent (Final Polish)
            print("[Thinking] Running Controller Agent constraints...")
            state_json = state_manager.get_context()
            prompt = f"{CONTROLLER_PROMPT}\n\nFinal Draft State:\n{state_json}"
            response = generate_response(prompt)
            data = safe_json(response)
            
            if "error" in data:
                print(f"[ControllerAgent Parse Error]: {data['raw']}")
                return state_manager.state
            
            state_manager.update(data)
            return state_manager.state
        except Exception as e:
            print(f"[Error in ControllerAgent]: {e}")
            return {}
