# ============================================================
# app/main.py
# ============================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import predict, heatmap, risk, report, chatbot, health
from app.core.logger import logger
from app.core.settings import settings
from app.models.model_loader import load_model
from app.rag.vector_store import initialize_vector_store

app = FastAPI(
    title="AI Skin Cancer Detection System",
    description="Backend API for AI-powered skin cancer detection",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(heatmap.router)
app.include_router(risk.router)
app.include_router(report.router)
app.include_router(chatbot.router)
app.include_router(health.router)


@app.on_event("startup")
async def startup_event():
    logger.info("Starting AI Skin Cancer Detection System...")
    try:
        load_model()
        logger.info("CNN model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load CNN model: {e}")
    try:
        initialize_vector_store()
        logger.info("Vector store initialized successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize vector store: {e}")