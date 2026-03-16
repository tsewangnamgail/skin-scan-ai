# ============================================================
# app/services/rag_chat_service.py
# Simple dermatology chatbot without external LLM dependency
# ============================================================
from app.core.logger import logger


_DERM_KB: dict[str, str] = {
    "melanoma": (
        "Melanoma is a serious form of skin cancer that starts in pigment-producing "
        "cells called melanocytes. It can spread (metastasize) if not detected early. "
        "Warning signs include changes in size, shape, or color of a mole, especially "
        "following the ABCDE rule (Asymmetry, Border irregularity, Color variation, "
        "Diameter > 6 mm, Evolving)."
    ),
    "nevus": (
        "A nevus (mole) is usually a benign cluster of melanocytes. Many people have "
        "multiple nevi on their skin. While most are harmless, new or changing moles "
        "should be evaluated by a dermatologist."
    ),
    "basal cell carcinoma": (
        "Basal cell carcinoma (BCC) is the most common skin cancer. It often appears "
        "as a pearly or translucent bump, a non-healing sore, or a scaly patch. BCC "
        "rarely spreads to distant organs but can be locally destructive."
    ),
    "actinic keratosis": (
        "Actinic keratosis (AK) is a rough, scaly patch caused by chronic sun damage. "
        "It is considered a precancerous lesion because a small percentage can progress "
        "to squamous cell carcinoma."
    ),
    "benign keratosis": (
        "Benign keratoses, such as seborrheic keratoses, are non-cancerous growths that "
        "can look warty or stuck-on. They typically do not turn into skin cancer."
    ),
    "dermatofibroma": (
        "Dermatofibroma is a common, benign fibrous nodule usually found on the legs. "
        "It often feels firm and may dimple when pinched."
    ),
    "vascular lesion": (
        "Vascular lesions (for example, hemangiomas) are benign overgrowths of blood "
        "vessels. They are usually harmless and often present as red or purple spots."
    ),
}


_GENERAL_FALLBACK = (
    "I can provide general information about common skin lesions such as melanoma, "
    "nevi (moles), basal cell carcinoma, actinic keratosis, benign keratoses, "
    "dermatofibromas, and vascular lesions. However, this is not a diagnosis. Any "
    "concerning or changing lesion should be evaluated by a dermatologist."
)


async def chat_with_rag(question: str) -> dict:
    """Return a knowledge-based answer without relying on external LLMs."""
    try:
        q_lower = (question or "").lower()

        for key, text in _DERM_KB.items():
            if key in q_lower:
                return {"response": text}

        if "melanoma" in q_lower:
            return {"response": _DERM_KB["melanoma"]}

        return {"response": _GENERAL_FALLBACK}
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return {
            "response": (
                "I encountered an internal error while processing your question. "
                "Please try again or consult a dermatologist for medical advice."
            )
        }