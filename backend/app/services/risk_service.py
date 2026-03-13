# ============================================================
# app/services/risk_service.py
# ============================================================

HIGH_RISK_CLASSES = [
    "melanoma",
    "mel",
    "Melanoma",
    "basal cell carcinoma",
    "bcc",
    "squamous cell carcinoma",
    "scc",
    "akiec",
    "Actinic keratoses",
]


def assess_risk(prediction: str, confidence: float) -> dict:
    prediction_lower = prediction.lower().strip()

    is_malignant = any(
        risk_class.lower() in prediction_lower for risk_class in HIGH_RISK_CLASSES
    )

    if is_malignant:
        if confidence > 0.7:
            risk_score = round(confidence * 100, 2)
            risk_level = "high"
            recommendation = (
                "Immediate consultation with a dermatologist is strongly recommended. "
                "The AI model has detected a high probability of a malignant skin lesion. "
                "Please seek professional medical evaluation as soon as possible."
            )
        elif confidence >= 0.4:
            risk_score = round(confidence * 100, 2)
            risk_level = "medium"
            recommendation = (
                "A dermatological consultation is recommended. "
                "The AI model has detected a moderate probability of a potentially malignant skin lesion. "
                "Further examination and possibly a biopsy may be needed."
            )
        else:
            risk_score = round(confidence * 100, 2)
            risk_level = "low"
            recommendation = (
                "The detected lesion appears to have a low probability of malignancy. "
                "However, regular skin monitoring and routine dermatological check-ups are advised."
            )
    else:
        if confidence > 0.7:
            risk_score = round((1 - confidence) * 100, 2)
            risk_level = "low"
            recommendation = (
                "The detected lesion appears to be benign with high confidence. "
                "Continue regular skin monitoring and maintain routine check-ups."
            )
        else:
            risk_score = round(50.0, 2)
            risk_level = "low"
            recommendation = (
                "The classification confidence is moderate. "
                "Consider a follow-up dermatological evaluation for confirmation."
            )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
    }