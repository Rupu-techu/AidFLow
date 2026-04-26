# AidFlow: Agentic Volunteer Intelligence System

AidFlow is a robust Multi-Agent AI pipeline designed to transform unstructured disaster/emergency reports into actionable response plans. By leveraging the **Gemini Flash** model family, the system autonomously analyzes severity, prioritizes needs, and allocates volunteer resources with realistic NGO mapping.

---

## 🤖 Agentic Architecture

The system uses a sequential orchestration of five specialized agents to ensure high precision:

1.  **Input Agent**: Sanitizes raw unstructured text and extracts critical entities (location, people count).
2.  **Classification Agent**: Categorizes the emergency type (Healthcare, Food, Shelter, etc.).
3.  **Priority Agent**: Calculates a severity score (0–100) and urgency levels.
4.  **Matching Agent**: Logic-driven volunteer selection based on NGO specializations.
5.  **Controller Agent**: The final validation layer that enforces scaling rules and resource distribution.

---

## 🛡️ Reliability Features

-   **Automatic Retries**: Built-in 3-attempt retry logic for all Gemini API calls to handle transient network errors.
-   **Intelligent Fallback**: In case of persistent API failure, the system falls back to a deterministic Mock API to ensure the service remains responsive.
-   **CORS Enabled**: Ready-to-go for frontend integration via standard browser security headers.
-   **Cloud-Ready**: Native support for `PORT` environment variables and containerization.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Google Gemini API Key

### Local Setup
1. **Initialize Environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # Linux/Mac
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure `.env`**:
   Create a `.env` file in the root:
   ```env
   GOOGLE_API_KEY=your_gemini_key_here
   GEMINI_MODEL=give_gemini_model_of_your_choise
   MOCK_API=False
   ```

4. **Run the API**:
   ```bash
   python api.py
   ```
   Access the interactive docs at: `http://127.0.0.1:8080/docs`

---

## 🐳 Docker & Deployment

Built for **Google Cloud Run** using a lightweight Python-slim image.

### Build the Image
```bash
docker build -t aidflow-backend .
```

### Deploy to Cloud Run
```bash
gcloud run deploy aidflow-backend \
  --image gcr.io/[PROJECT_ID]/aidflow-backend \
  --set-env-vars GOOGLE_API_KEY=[KEY],MOCK_API=False
```

---

## 📍 API Reference

### `GET /`
Returns the status of the service and current operating mode (Mock vs Live).

### `POST /process`
Main entry point for situation analysis.
**Payload:**
```json
{
  "text": "Severe landslide in Wayanad, multiple houses destroyed, medical help needed."
}
```

### `GET /health`
Standard health-check endpoint.
