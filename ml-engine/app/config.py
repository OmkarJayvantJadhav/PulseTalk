"""
Configuration settings for ML Engine
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # Models
    SENTIMENT_MODEL: str = "distilbert-base-uncased-finetuned-sst-2-english"
    EMOTION_MODEL: str = "j-hartmann/emotion-english-distilroberta-base"
    SUMMARIZATION_MODEL: str = "sshleifer/distilbart-cnn-12-6"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5000,http://localhost:5173"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
