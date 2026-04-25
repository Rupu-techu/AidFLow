import os
import json
from dotenv import load_dotenv
from agents.controller_agent import ControllerAgent

def main():
    load_dotenv()

    print("=== Agentic Volunteer Intelligence System ===\n")
    user_input = input("Enter situation description: ").strip()

    if not user_input:
        print(json.dumps({"status": "waiting_for_input", "message": "Please enter a problem description."}, indent=2))
        return

    result = ControllerAgent().process(user_input)

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