import json
from config.gemini_client import generate_response
from config.prompts import CLASSIFICATION_PROMPT

def safe_json(response):
    try:
        start, end = response.find('{'), response.rfind('}')
        cleaned = response[start:end+1] if start != -1 and end != -1 else response
        return json.loads(cleaned)
    except:
        return {"error": "Invalid JSON", "raw": response}

class ClassificationAgent:
    def __init__(self, client=None):
        pass

    def process(self, state_json: str) -> dict:
        try:
            prompt = f"{CLASSIFICATION_PROMPT}\n\nCurrent State:\n{state_json}"
            response = generate_response(prompt)
            data = safe_json(response)
            if "error" in data:
                print(f"[ClassificationAgent Parse Error]: {data['raw']}")
                return {"need_type": "Unknown", "confidence": 0.0}
            return data
        except Exception as e:
            print(f"[Error in ClassificationAgent]: {e}")
            return {"need_type": "Unknown", "confidence": 0.0}
