"""
ML Service - Sentiment and Emotion Analysis using Hugging Face Transformers
"""

import logging
from typing import Dict, List, Any, Optional

from transformers import pipeline

from app.config import settings
from app.models.schemas import AnalysisResult, EmotionScore

logger = logging.getLogger(__name__)


class MLService:
    """
    Machine Learning service for sentiment and emotion analysis.
    Loads models at startup and provides analysis methods.
    """
    
    def __init__(self):
        self.sentiment_pipeline = None
        self.emotion_pipeline = None
        self.summarization_pipeline = None
        self.models_loaded = False
    
    def load_models(self) -> None:
        """Load sentiment, emotion, and summarization models"""
        try:
            logger.info(f"Loading sentiment model: {settings.SENTIMENT_MODEL}")
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model=settings.SENTIMENT_MODEL,
                top_k=None  # Return all labels with scores
            )
            
            logger.info(f"Loading emotion model: {settings.EMOTION_MODEL}")
            self.emotion_pipeline = pipeline(
                "text-classification",
                model=settings.EMOTION_MODEL,
                top_k=None  # Return all emotions with scores
            )
            
            if settings.ENABLE_SUMMARIZATION:
                logger.info(f"Loading summarization model: {settings.SUMMARIZATION_MODEL}")
                self.summarization_pipeline = pipeline(
                    "summarization",
                    model=settings.SUMMARIZATION_MODEL
                )
            else:
                logger.info("Summarization disabled for low-memory deployment")
            
            self.models_loaded = True
            logger.info("All models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise RuntimeError(f"Model loading failed: {e}")
    
    def _normalize_sentiment(self, label: str) -> str:
        """Normalize sentiment labels to standard format"""
        label_lower = label.lower()
        if label_lower in ["positive", "pos", "1"]:
            return "positive"
        elif label_lower in ["negative", "neg", "0"]:
            return "negative"
        else:
            return "neutral"
    
    def _get_sentiment_result(self, text: str) -> Dict[str, Any]:
        """Get sentiment analysis result for text"""
        results = self.sentiment_pipeline(text[:10000], truncation=True, max_length=512)
        
        # Results is a list of dicts with 'label' and 'score'
        if results and len(results) > 0:
            # Get the top result (highest confidence)
            top_result = max(results[0], key=lambda x: x['score'])
            sentiment = self._normalize_sentiment(top_result['label'])
            score = top_result['score']
            
            return {
                "sentiment": sentiment,
                "sentiment_score": score
            }
        
        return {
            "sentiment": "neutral",
            "sentiment_score": 0.5
        }
    
    def _get_emotion_result(self, text: str) -> Dict[str, Any]:
        """Get emotion analysis result for text"""
        results = self.emotion_pipeline(text[:10000], truncation=True, max_length=512)
        
        emotions = []
        dominant_emotion = "neutral"
        max_score = 0.0
        
        if results and len(results) > 0:
            for item in results[0]:
                emotion = item['label'].lower()
                score = item['score']
                emotions.append(EmotionScore(emotion=emotion, score=round(score, 4)))
                
                if score > max_score:
                    max_score = score
                    dominant_emotion = emotion
        
        # Sort emotions by score descending
        emotions.sort(key=lambda x: x.score, reverse=True)
        
        return {
            "emotions": emotions,
            "dominant_emotion": dominant_emotion
        }

    def _get_summary(self, text: str) -> Optional[str]:
        """Generate a summary of the text"""
        if not settings.ENABLE_SUMMARIZATION or self.summarization_pipeline is None:
            return None

        # Summarizer works best on reasonable length text. 
        # If very short (< 50 chars), ignore.
        if len(text) < 50:
            return None
            
        try:
            # We use a larger chunk for summarization but respect model limits (usually 1024 tokens)
            # We will pass 4000 chars approx.
            # distilbart defaults: max_length=142, min_length=56
            input_text = text[:10000] 
            
            summary_results = self.summarization_pipeline(
                input_text, 
                truncation=True, 
                max_length=150, 
                min_length=30, 
                do_sample=False
            )
            
            if summary_results and len(summary_results) > 0:
                return summary_results[0]['summary_text']
            
        except Exception as e:
            logger.warning(f"Summarization failed: {e}")
            return None
            
        return None
    
    def analyze_text(self, text: str) -> AnalysisResult:
        """
        Analyze a single text for sentiment, emotions, and summary.
        
        Args:
            text: The text to analyze
            
        Returns:
            AnalysisResult with sentiment, score, confidence, emotions, and summary
        """
        if not self.models_loaded:
            raise RuntimeError("Models not loaded")
        
        # Get sentiment analysis
        sentiment_result = self._get_sentiment_result(text)
        
        # Get emotion analysis
        emotion_result = self._get_emotion_result(text)
        
        # Get summary
        summary = self._get_summary(text)
        
        # Calculate overall confidence (average of sentiment and dominant emotion scores)
        emotion_confidence = max([e.score for e in emotion_result["emotions"]], default=0.5)
        confidence = (sentiment_result["sentiment_score"] + emotion_confidence) / 2
        
        return AnalysisResult(
            text=text,
            sentiment=sentiment_result["sentiment"],
            sentiment_score=round(sentiment_result["sentiment_score"], 4),
            confidence=round(confidence, 4),
            emotions=emotion_result["emotions"],
            dominant_emotion=emotion_result["dominant_emotion"],
            summary=summary
        )
    
    def analyze_batch(self, texts: List[str]) -> List[AnalysisResult]:
        """
        Analyze multiple texts.
        """
        return [self.analyze_text(text) for text in texts]
