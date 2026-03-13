# ============================================================
# app/utils/gradcam.py
# ============================================================
import numpy as np
import tensorflow as tf
from app.models.model_loader import get_model
from app.utils.image_processing import preprocess_image
from app.core.logger import logger


def _find_last_conv_layer(model: tf.keras.Model) -> str:
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
        if hasattr(layer, "layers"):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, tf.keras.layers.Conv2D):
                    return layer.name + "/" + sub_layer.name if hasattr(layer, 'name') else sub_layer.name

    for layer in reversed(model.layers):
        if len(layer.output_shape) == 4 if isinstance(layer.output_shape, tuple) else False:
            return layer.name

    for layer in reversed(model.layers):
        try:
            output_shape = layer.output.shape
            if len(output_shape) == 4:
                return layer.name
        except (AttributeError, RuntimeError):
            continue

    raise ValueError("Could not find a convolutional layer in the model.")


def _find_target_conv_layer(model: tf.keras.Model) -> str:
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
        if hasattr(layer, "layers"):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, tf.keras.layers.Conv2D):
                    return sub_layer.name

    for layer in reversed(model.layers):
        try:
            if len(layer.output.shape) == 4:
                return layer.name
        except (AttributeError, RuntimeError):
            continue

    raise ValueError("No suitable convolutional layer found for GradCAM.")


def compute_gradcam(img_array: np.ndarray) -> np.ndarray:
    model = get_model()
    preprocessed = preprocess_image(img_array)

    last_conv_layer_name = None

    for layer in model.layers:
        if hasattr(layer, "layers"):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, tf.keras.layers.Conv2D):
                    last_conv_layer_name = layer.name
                    break
            if last_conv_layer_name:
                break

    if last_conv_layer_name is None:
        for layer in reversed(model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                last_conv_layer_name = layer.name
                break

    if last_conv_layer_name is None:
        for layer in reversed(model.layers):
            try:
                if len(layer.output.shape) == 4:
                    last_conv_layer_name = layer.name
                    break
            except (AttributeError, RuntimeError):
                continue

    if last_conv_layer_name is None:
        logger.warning("Could not find conv layer, returning uniform heatmap")
        return np.ones((224, 224), dtype=np.float32) * 0.5

    logger.info(f"Using layer for GradCAM: {last_conv_layer_name}")

    try:
        grad_model = tf.keras.Model(
            inputs=model.input,
            outputs=[model.get_layer(last_conv_layer_name).output, model.output],
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(preprocessed)
            predicted_class = tf.argmax(predictions[0])
            class_output = predictions[:, predicted_class]

        grads = tape.gradient(class_output, conv_outputs)

        if grads is None:
            logger.warning("Gradients are None, returning uniform heatmap")
            return np.ones((224, 224), dtype=np.float32) * 0.5

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs_val = conv_outputs[0]

        heatmap = tf.reduce_sum(conv_outputs_val * pooled_grads, axis=-1)
        heatmap = tf.nn.relu(heatmap)

        heatmap_max = tf.reduce_max(heatmap)
        if heatmap_max > 0:
            heatmap = heatmap / heatmap_max

        heatmap = heatmap.numpy()
        return heatmap

    except Exception as e:
        logger.error(f"GradCAM computation failed: {e}")
        return np.ones((224, 224), dtype=np.float32) * 0.5