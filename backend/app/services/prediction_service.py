# ============================================================
# app/services/prediction_service.py
# ============================================================
import numpy as np
from app.models.inference import predict
from app.models.model_loader import get_labels


def run_prediction(img_array: np.ndarray) -> dict:
    probabilities = predict(img_array)
    labels = get_labels()
    prob_list = probabilities[0].tolist()

    # Make sure labels length matches model output length
    num_classes = len(prob_list)
    if len(labels) != num_classes:
        labels = labels[:num_classes]

    class_probabilities = {}
    for i, label in enumerate(labels):
        class_probabilities[label] = round(prob_list[i], 6)

    predicted_index = int(np.argmax(probabilities[0]))
    predicted_class = labels[predicted_index]
    confidence = round(float(probabilities[0][predicted_index]), 6)

    return {
        "prediction": predicted_class,
        "confidence": confidence,
        "probabilities": class_probabilities,
    }