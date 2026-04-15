import json

class StateManager:
    def __init__(self):
        self.state = {
            "raw_input": "",
            "cleaned_input": "",
            "location": "Unknown",
            "people_count": 0,
            "need_type": "Unknown",
            "severity": "Unknown",
            "urgency": "Unknown",
            "priority_score": 0,
            "assigned_volunteer": "Unknown",
            "volunteer_count": 0,
            "volunteer_plan": [],
            "resource_distribution": {},
            "reasoning_summary": "",
            "confidence": 0.0
        }

    def update(self, new_data: dict):
        """Update state safely with valid data."""
        for key, value in new_data.items():
            if key in self.state and value is not None and value != "":
                self.state[key] = value

    def get_context(self) -> str:
        """Returns the current state as standard JSON string."""
        return json.dumps(self.state, indent=2)
