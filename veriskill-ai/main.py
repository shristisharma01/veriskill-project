from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ScanRequest(BaseModel):
    content: str
    type: str  # "RESUME" or "EMAIL"

PHISHING_KEYWORDS = [
    "urgent", "verify your account", "click here",
    "suspended", "bank", "password", "winner",
    "lottery", "free money"
]

INFLATION_KEYWORDS = [
    "expert in everything",
    "10+ years in 2 years",
    "managed 100+ people",
    "ceo at 22"
]

@app.get("/")
def home():
    return {"message": "AI Service Running"}

@app.post("/analyze")
def analyze(request: ScanRequest):
    content_lower = request.content.lower()
    suspicious = []

    if request.type == "EMAIL":
        for keyword in PHISHING_KEYWORDS:
            if keyword in content_lower:
                suspicious.append(f"Phishing keyword detected: '{keyword}'")

    elif request.type == "RESUME":
        for keyword in INFLATION_KEYWORDS:
            if keyword in content_lower:
                suspicious.append(f"Exaggerated claim: '{keyword}'")

    score = max(0.0, 1.0 - (len(suspicious) * 0.2))
    risk = "LOW" if score > 0.7 else "MEDIUM" if score > 0.4 else "HIGH"

    return {
        "credibilityScore": round(score, 2),
        "riskLevel": risk,
        "suspiciousElements": suspicious,
        "explanation": f"Found {len(suspicious)} suspicious pattern(s). Score: {score:.0%}",
        "isFake": score < 0.5
    }