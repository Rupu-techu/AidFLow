from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def get_mock_response(prompt: str) -> str:
    """Returns static JSON responses for dry-run testing."""
    if "intelligent input processing" in prompt:
        return '{"cleaned_input": "Mock severe storm in Kolkata", "location": "Kolkata", "people_count": 20, "urgency": "High", "confidence": 0.9}'
    elif "classification agent" in prompt:
        return '{"need_type": "Shelter", "confidence": 0.95}'
    elif "priority scoring" in prompt:
        return '{"severity": "High", "urgency": "High", "priority_score": 90, "confidence": 0.85}'
    elif "volunteer matching" in prompt:
        return '{"assigned_volunteer": "Mock matching successful", "confidence": 0.9}'
    elif "Controller Agent" in prompt:
        return '''{
          "location": "Kolkata",
          "people_count": 20,
          "need_type": "Shelter",
          "severity": "High",
          "urgency": "High",
          "priority_score": 90,
          "volunteer_count": 2,
          "volunteer_plan": [
            {
              "name": "Amit Sharma",
              "role": "Logistics",
              "skills": ["Coordination", "Evacuation"],
              "organization": "NDRF",
              "strength": "Quick response",
              "assigned_task": "Clear clogged roads"
            },
            {
              "name": "Priya Singh",
              "role": "Food Supply",
              "skills": ["Distribution", "Management"],
              "organization": "Goonj",
              "strength": "Resource management",
              "assigned_task": "Distribute food packets"
            }
          ],
          "resource_distribution": {
            "medical_team": 0,
            "food_supply_team": 1,
            "rescue_team": 0,
            "logistics_team": 1
          },
          "reasoning_summary": "Mock reasoning for test",
          "confidence": 0.99
        }'''
    return "{}"

def generate_response(prompt: str):
    if os.getenv("MOCK_API", "False").lower() in ("true", "1", "yes"):
        print("[MOCK_API=True] Using simulated response...")
        return get_mock_response(prompt)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("Gemini Error:", e)
        return "{}"
