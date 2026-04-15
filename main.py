import os
import json
from dotenv import load_dotenv
from memory.state_manager import StateManager
from agents.input_agent import InputAgent
from agents.classification_agent import ClassificationAgent
from agents.priority_agent import PriorityAgent
from agents.matching_agent import MatchingAgent
from agents.controller_agent import ControllerAgent

def main():
    load_dotenv()
    state_manager = StateManager()

    print("=== Agentic Volunteer Intelligence System ===\n")
    user_input = input("Enter situation description: ").strip()

    if not user_input:
        print(json.dumps({"status": "waiting_for_input", "message": "Please enter a problem description."}, indent=2))
        return

    state_manager.update({"raw_input": user_input})

    # Step 1: Input Agent Pipeline
    print("\n[Thinking] Running Input Agent...")
    input_results = InputAgent().process(user_input)
    state_manager.update(input_results)

    # Step 2: Classification Agent
    print("[Thinking] Running Classification Agent...")
    class_results = ClassificationAgent().process(state_manager.get_context())
    state_manager.update(class_results)

    # Step 3: Priority Agent
    print("[Thinking] Running Priority Agent...")
    priority_results = PriorityAgent().process(state_manager.get_context())
    state_manager.update(priority_results)

    # Step 4: Matching Agent
    print("[Thinking] Running Matching Agent...")
    match_results = MatchingAgent().process(state_manager.get_context())
    state_manager.update(match_results)

    # Step 5: Controller Agent (Final Polish)
    print("\n[Thinking] Running Controller Agent constraints...")
    final_results = ControllerAgent().process(state_manager.get_context())
    state_manager.update(final_results)

    result = state_manager.state
    volunteers = result.get("volunteer_plan", [])

    if volunteers:
        assigned_volunteer = ", ".join([v.get("name", "Unknown") for v in volunteers])
    else:
        assigned_volunteer = "Unknown"

    print("\n================ FINAL REPORT ================")
    print(json.dumps(result, indent=2))
    
    print("\n=== VOLUNTEER TEAM ===")
    if volunteers:
        for v in volunteers:
            print(f"- {v.get('name', 'Unknown')} | {v.get('role', 'Unknown')} | {v.get('organization', 'Unknown')}")
    else:
        print("- Unknown")
    print("==============================================")

if __name__ == "__main__":
    main()