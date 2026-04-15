import json
from config.gemini_client import generate_response
from config.prompts import MATCHING_PROMPT

def safe_json(response):
    try:
        start, end = response.find('{'), response.rfind('}')
        cleaned = response[start:end+1] if start != -1 and end != -1 else response
        return json.loads(cleaned)
    except:
        return {"error": "Invalid JSON", "raw": response}

class MatchingAgent:
    def __init__(self, client=None):
        pass

    def process(self, state_json: str) -> dict:
        try:
            prompt = f"{MATCHING_PROMPT}\n\nCurrent State:\n{state_json}"
            response = generate_response(prompt)
            data = safe_json(response)
            if "error" in data:
                print(f"[MatchingAgent Parse Error]: {data['raw']}")
                return {"assigned_volunteer": "Unknown", "confidence": 0.0}
            
            if not data.get("assigned_volunteer"):
                data["assigned_volunteer"] = "Unknown"
            return data
        except Exception as e:
            print(f"[Error in MatchingAgent]: {e}")
            return {"assigned_volunteer": "Unknown", "confidence": 0.0}
