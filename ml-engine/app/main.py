"""
PulseTalk ML Engine - FastAPI Application
Sentiment and emotion analysis using Hugging Face Transformers
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import analyze
from app.services.ml_service import MLService

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ML Service instance (singleton)
ml_service: MLService = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - initialize service; models load lazily."""
    global ml_service
    logger.info("Initializing ML service...")
    ml_service = MLService()
    logger.info("ML service initialized (lazy model loading enabled)")
    
    # Make ml_service available to routes
    app.state.ml_service = ml_service
    
    yield
    
    # Cleanup on shutdown
    logger.info("Shutting down ML Engine")


app = FastAPI(
    title="PulseTalk ML Engine",
    description="AI-powered sentiment and emotion analysis API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ml-engine",
        "version": "1.0.0",
        "models_loaded": ml_service is not None and ml_service.models_loaded
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "PulseTalk ML Engine",
        "docs": "/docs",
        "health": "/health"
    }
