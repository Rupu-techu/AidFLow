import json
from config.gemini_client import generate_response
from config.prompts import INPUT_PROMPT

def safe_json(response):
    try:
        start, end = response.find('{'), response.rfind('}')
        cleaned = response[start:end+1] if start != -1 and end != -1 else response
        return json.loads(cleaned)
    except:
        return {"error": "Invalid JSON", "raw": response}

class InputAgent:
    def __init__(self, client=None):
        pass

    def process(self, raw_input: str) -> dict:
        try:
            prompt = f"{INPUT_PROMPT}\n\nRaw Input: {raw_input}"
            response = generate_response(prompt)
            data = safe_json(response)
            if "error" in data:
                print(f"[InputAgent Parse Error]: {data['raw']}")
                return {}
            return data
        except Exception as e:
            print(f"[Error in InputAgent]: {e}")
            return {}
