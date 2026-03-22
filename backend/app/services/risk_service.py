# ============================================================
# app/services/risk_service.py
# ============================================================
import json
import asyncio
from app.schemas.risk_schema import RiskRequest
from app.rag.groq_client import get_groq_llm
from app.core.logger import logger

async def assess_risk(request: RiskRequest) -> dict:
    """Implement logic-driven and intelligent risk assessment using LLM."""
    
    user_data = {
        "prediction": request.prediction,
        "confidence": request.confidence,
        "melanoma_probability": request.melanoma_probability,
        "age_group": request.age_group,
        "skin_type": request.skin_type,
        "sunburn_history": request.sunburn_history,
        "family_history": request.family_history,
        "sun_exposure": request.sun_exposure,
    }

    prompt = f"""You are an AI assistant responsible for calculating skin cancer risk.
Analyze the following user data and generate a realistic risk percentage based on the rules below.

DATA:
{json.dumps(user_data, indent=2)}

-----------------------------------
CORE RULES:
-----------------------------------
1. Base Risk = 1%.
2. Categorize every input as LOW, MEDIUM, or HIGH impact based on medical common sense.
   - Example: "Often", "Type 1", "elderly", "high exposure" = HIGH
   - Example: "1-5 times", "medium", "moderate" = MODERATE
   - Example: "never", "low" = LOW
3. Weighted Scoring per factor:
   - LOW IMPACT → add 0.5% to 1.0%
   - MODERATE IMPACT → add 1.0% to 3.0%
   - HIGH IMPACT → add 3.0% to 5.0%
4. Strongest increases: Family history, recurring sunburns, high exposure.
5. Clamping: Final sum MUST be between 1% and 25%.
6. Classification:
   - 1–5% → Low
   - 6–12% → Moderate
   - 13–25% → High

RETURN JSON ONLY:
{{
  "risk_percentage": float,
  "risk_level": "Low | Moderate | High",
  "explanation": "Short summary of key contributing factors."
}}"""

    try:
        llm = get_groq_llm()
        result = await asyncio.to_thread(llm.invoke, prompt)
        
        # Parse JSON
        text = result.content.strip()
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"): text = text[4:]
        
        data = json.loads(text.strip())
        
        return {
            "risk_percentage": float(data.get("risk_percentage", 5.0)),
            "risk_level": data.get("risk_level", "Low"),
            "explanation": data.get("explanation", "Assessment based on provided medical history.")
        }
    except Exception as e:
        logger.error(f"AI Risk Assessment error: {e}", exc_info=True)
        # Conservative fallback
        return {
            "risk_percentage": 2.5,
            "risk_level": "Low",
            "explanation": "Assessment currently limited. Consult a physician for accurate screening."
        }