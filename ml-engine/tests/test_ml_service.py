"""
ML Service Tests
Run with: pytest
"""

import pytest
from app.services.ml_service import MLService


@pytest.fixture
def ml_service():
    """Create ML service instance and load models"""
    service = MLService()
    service.load_models()
    return service


def test_sentiment_analysis_positive(ml_service):
    """Test positive sentiment detection"""
    result = ml_service.analyze_text("I love this product! It's amazing!")
    
    assert result.sentiment == "positive"
    assert result.sentiment_score > 0.7
    assert result.confidence > 0
    assert len(result.emotions) > 0


def test_sentiment_analysis_negative(ml_service):
    """Test negative sentiment detection"""
    result = ml_service.analyze_text("This is terrible. I hate it.")
    
    assert result.sentiment == "negative"
    assert result.sentiment_score > 0.7
    assert result.confidence > 0


def test_sentiment_analysis_neutral(ml_service):
    """Test neutral sentiment detection"""
    result = ml_service.analyze_text("The sky is blue.")
    
    assert result.sentiment in ["positive", "negative", "neutral"]
    assert 0 <= result.sentiment_score <= 1
    assert 0 <= result.confidence <= 1


def test_emotion_detection(ml_service):
    """Test emotion analysis"""
    result = ml_service.analyze_text("I'm so happy and excited!")
    
    assert result.dominant_emotion is not None
    assert len(result.emotions) > 0
    assert all(0 <= e.score <= 1 for e in result.emotions)


def test_batch_analysis(ml_service):
    """Test batch analysis"""
    texts = [
        "This is great!",
        "This is bad.",
        "This is okay."
    ]
    
    results = ml_service.analyze_batch(texts)
    
    assert len(results) == 3
    assert all(r.sentiment in ["positive", "negative", "neutral"] for r in results)


def test_long_text_truncation(ml_service):
    """Test that long texts are handled properly"""
    long_text = "Great! " * 1000  # Very long text
    
    result = ml_service.analyze_text(long_text)
    
    assert result.sentiment == "positive"
    assert result.confidence > 0
