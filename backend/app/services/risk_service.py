# ============================================================
# app/services/risk_service.py
# ============================================================

from typing import Tuple


def _risk_from_melanoma_probability(melanoma_prob: float) -> Tuple[float, str, str]:
    """Apply your melanoma-based risk rules."""
    melanoma_prob = max(0.0, min(1.0, float(melanoma_prob)))
    risk_score = round(melanoma_prob * 100.0, 2)

    if melanoma_prob > 0.5:
        risk_level = "high"
        recommendation = (
            "High risk of melanoma based on the model's probability. "
            "Consult a dermatologist or skin cancer specialist immediately for "
            "clinical evaluation and possible biopsy."
        )
    elif 0.2 <= melanoma_prob <= 0.5:
        risk_level = "medium"
        recommendation = (
            "Medium risk of melanoma. The lesion should be closely monitored for "
            "changes in size, color, or shape, and a dermatology appointment is "
            "recommended in the near term."
        )
    else:
        risk_level = "low"
        recommendation = (
            "Low estimated risk of melanoma. Routine skin self-examinations and "
            "periodic dermatological check-ups are still recommended."
        )

    return risk_score, risk_level, recommendation


def assess_risk(
    prediction: str,
    confidence: float,
    melanoma_probability: float | None = None,
) -> dict:
    """Compute risk using melanoma probability when available.

    - If melanoma_probability is provided, it is used directly.
    - Otherwise, a conservative fallback is used:
        * if prediction is melanoma-like, use confidence as melanoma probability
        * else, assume melanoma probability is near zero.
    """
    prediction_lower = (prediction or "").lower().strip()

    if melanoma_probability is not None:
        mel_prob = melanoma_probability
    else:
        if "melanoma" in prediction_lower or "mel" == prediction_lower:
            mel_prob = confidence
        else:
            mel_prob = 0.0

    risk_score, risk_level, recommendation = _risk_from_melanoma_probability(mel_prob)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
    }