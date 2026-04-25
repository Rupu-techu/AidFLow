from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict
import os
from dotenv import load_dotenv

# Import core components
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

class FollowUpRequest(BaseModel):
    question: str
    context: Dict[str, Any]

def _safe_value(value, fallback="Unknown"):
    if value is None or value == "":
        return fallback
    return value

def _safe_int(value, fallback=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback

def enrich_agent_state(state: dict) -> dict:
    """Add a vivid command briefing around the structured agent result."""
    enriched = dict(state or {})
    raw_input = _safe_value(enriched.get("raw_input"), "the submitted crisis report")
    location = _safe_value(enriched.get("location"))
    need_type = _safe_value(enriched.get("need_type"), "response")
    severity = _safe_value(enriched.get("severity"))
    urgency = _safe_value(enriched.get("urgency"))
    people_count = _safe_int(enriched.get("people_count"))
    priority_score = _safe_int(enriched.get("priority_score"))
    volunteer_count = _safe_int(enriched.get("volunteer_count"))
    resource_distribution = enriched.get("resource_distribution") or {}

    if priority_score >= 85 or severity.lower() in ("high", "critical"):
        operating_mode = "rapid stabilization"
        risk_readout = "The report indicates a high-pressure incident where delay can increase harm, displacement, or access failure."
    elif priority_score >= 55 or severity.lower() == "medium":
        operating_mode = "controlled escalation"
        risk_readout = "The incident appears serious enough to require organized support, but it may still be containable with fast confirmation."
    else:
        operating_mode = "local support"
        risk_readout = "The situation appears manageable, but the agents still recommend verification and structured follow-through."

    medical = _safe_int(resource_distribution.get("medical_team"))
    food = _safe_int(resource_distribution.get("food_supply_team"))
    rescue = _safe_int(resource_distribution.get("rescue_team"))
    logistics = _safe_int(resource_distribution.get("logistics_team"))

    agent_message = (
        f"Command readout: the agents interpret this as a {severity.lower()}-severity "
        f"{need_type.lower()} situation in {location}. The working estimate is {people_count} "
        f"people affected, with {urgency.lower()} urgency and a priority score of {priority_score}/100. "
        f"The response should begin in {operating_mode} mode: confirm the ground truth, protect people at immediate risk, "
        f"and move volunteers into clear roles before the scene becomes noisy."
    )

    reasoning_summary = enriched.get("reasoning_summary") or ""
    if not reasoning_summary or reasoning_summary.lower().startswith("mock reasoning"):
        reasoning_summary = (
            f"The pipeline weighted the crisis description, affected population, urgency language, and likely access constraints. "
            f"Because the need is classified as {need_type} with {severity} severity, it recommends {volunteer_count} volunteers "
            f"split across medical ({medical}), food supply ({food}), rescue ({rescue}), and logistics ({logistics}) capacity."
        )

    enriched.update({
        "agent_message": agent_message,
        "reasoning_summary": reasoning_summary,
        "situation_brief": {
            "overview": (
                f"Incoming report: {raw_input}. The agents normalized it into a response plan centered on {location}, "
                f"{need_type.lower()} support, and {volunteer_count} deployable volunteers."
            ),
            "risk_readout": risk_readout,
            "operational_focus": (
                "Stabilize immediate danger, verify affected people, route volunteers by skill, and keep logistics visible."
            ),
            "field_assumptions": [
                "The people count is treated as an operational estimate until confirmed by a coordinator.",
                "Volunteer allocation is based on the current description and should update if injuries, access, or shelter needs change.",
                "Resource distribution favors the teams most relevant to the classified need type and urgency."
            ]
        },
        "immediate_actions": [
            f"Confirm exact location and safest access route for {location}.",
            "Contact a local coordinator or verified field reporter for injury, water, shelter, and rescue status.",
            "Dispatch the first volunteer wave with clear roles, check-in times, and escalation contacts.",
            "Keep a live list of unresolved needs so the plan can be updated as new information arrives."
        ],
        "counter_questions": [
            {
                "question": "Are there injuries, trapped people, or medical emergencies right now?",
                "answer": "If yes, increase medical and rescue priority immediately and send exact numbers to the coordinator."
            },
            {
                "question": "Is the affected area reachable by road, or are routes blocked?",
                "answer": "If access is blocked, logistics should shift toward route discovery, local staging points, and rescue support."
            },
            {
                "question": "What is the most urgent shortage: water, food, shelter, medicine, or evacuation?",
                "answer": "The answer should decide which volunteer team receives the next deployment slot."
            }
        ],
        "follow_up_questions": [
            "How should we split the volunteers if injuries increase?",
            "What should be verified before dispatching the first team?",
            "Which NGO should handle logistics for this case?",
            "What is the first 30-minute action plan?"
        ]
    })

    return enriched

def build_follow_up_answer(question: str, context: dict) -> dict:
    """Return a focused answer grounded in the current agent state."""
    question_text = question.strip()
    lower_question = question_text.lower()
    location = _safe_value(context.get("location"))
    need_type = _safe_value(context.get("need_type"), "response")
    severity = _safe_value(context.get("severity"))
    urgency = _safe_value(context.get("urgency"))
    priority_score = _safe_int(context.get("priority_score"))
    volunteer_count = _safe_int(context.get("volunteer_count"))
    resource_distribution = context.get("resource_distribution") or {}

    if "30" in lower_question or "first" in lower_question or "immediate" in lower_question:
        answer = (
            f"First move: treat {location} as a {severity.lower()}-severity active response. "
            "Within 30 minutes, confirm the exact location, identify the safest access route, verify injuries and trapped people, "
            "then dispatch the first volunteers with one coordinator tracking updates."
        )
        action_items = [
            "Confirm location and contact person.",
            "Verify injuries, trapped people, and access route.",
            "Assign one coordinator to maintain the live situation log."
        ]
    elif "volunteer" in lower_question or "team" in lower_question or "split" in lower_question:
        answer = (
            f"Use {volunteer_count} volunteers as the current ceiling. Keep the split close to the agent distribution: "
            f"medical {resource_distribution.get('medical_team', 0)}, food {resource_distribution.get('food_supply_team', 0)}, "
            f"rescue {resource_distribution.get('rescue_team', 0)}, logistics {resource_distribution.get('logistics_team', 0)}. "
            "If injuries or trapped people increase, shift the next available unit toward medical or rescue."
        )
        action_items = [
            "Keep one person responsible for coordination.",
            "Rebalance teams when injury, access, or shortage data changes.",
            "Avoid sending volunteers without a task and reporting loop."
        ]
    elif "ngo" in lower_question or "organization" in lower_question:
        answer = (
            f"For a {need_type.lower()} case at {location}, use specialized partners first: Red Cross or UNICEF for medical needs, "
            "NDRF for rescue, Goonj or CARE India for food and relief supply, and a mixed logistics group for routing and staging."
        )
        action_items = [
            "Match NGO specialization to the need type.",
            "Give each NGO one clear task owner.",
            "Escalate only verified numbers and locations."
        ]
    else:
        answer = (
            f"Based on the current agent state, this is a {severity.lower()}-severity, {urgency.lower()}-urgency "
            f"{need_type.lower()} situation with priority {priority_score}/100. The safest next step is to verify missing field details, "
            "then adjust volunteer allocation from the live evidence rather than from assumptions."
        )
        action_items = [
            "Ask for the missing field detail.",
            "Update affected count and access status.",
            "Re-run the plan if severity or urgency changes."
        ]

    return {
        "answer": answer,
        "action_items": action_items,
        "grounded_in": {
            "location": location,
            "severity": severity,
            "urgency": urgency,
            "priority_score": priority_score
        }
    }

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

    try:
        final_state = enrich_agent_state(ControllerAgent().process(request.text))
        return final_state
    except Exception as e:
        print(f"[API Error]: {e}")
        return {
            "error": "Pipeline Failure",
            "detail": str(e)
        }

@app.post("/ask")
async def ask_follow_up(request: FollowUpRequest):
    """
    Answers a follow-up question using the latest structured agent state.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if not request.context:
        raise HTTPException(status_code=400, detail="Context cannot be empty")

    try:
        return build_follow_up_answer(request.question, request.context)
    except Exception as e:
        print(f"[Ask Error]: {e}")
        return {
            "error": "Follow-up Failure",
            "detail": str(e)
        }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mock_api": os.getenv("MOCK_API", "False")}

if __name__ == "__main__":
    import uvicorn
    # Default to 8001 locally to avoid common Windows conflicts on 8000.
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
