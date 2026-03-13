# ============================================================
# app/services/report_service.py
# ============================================================
from app.rag.groq_client import get_groq_llm
from app.core.logger import logger


async def generate_report(
    prediction: str, confidence: float, risk_level: str
) -> dict:
    llm = get_groq_llm()

    prompt = f"""You are a medical AI assistant specializing in dermatology. Generate a professional medical-style report based on the following AI skin lesion analysis results.

AI Analysis Results:
- Diagnosis: {prediction}
- Confidence: {confidence * 100:.2f}%
- Risk Level: {risk_level}

Generate a structured medical report with the following sections:

1. **Diagnosis**: State the AI-predicted diagnosis clearly.
2. **Confidence Assessment**: Explain the confidence level and what it means.
3. **Clinical Explanation**: Provide a brief medical explanation of the detected condition.
4. **Risk Level Assessment**: Explain the risk level and its implications.
5. **Recommended Actions**: Provide specific medical recommendations based on the diagnosis and risk level.
6. **Disclaimer**: Include a medical disclaimer that this is an AI-assisted analysis and should not replace professional medical advice.

Format the report professionally. Be thorough but concise."""

    try:
        response = llm.invoke(prompt)
        report_text = response.content if hasattr(response, "content") else str(response)
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        report_text = (
            f"AI Medical Report\n\n"
            f"Diagnosis: {prediction}\n"
            f"Confidence: {confidence * 100:.2f}%\n"
            f"Risk Level: {risk_level}\n\n"
            f"Note: AI report generation encountered an error. "
            f"Please consult a dermatologist for professional evaluation."
        )

    return {"report": report_text}