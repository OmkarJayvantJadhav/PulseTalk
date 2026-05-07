/**
 * ML Engine Service
 * Handles communication with FastAPI ML Engine
 */

const axios = require('axios');
const { logger } = require('../config/logger');

const ML_ENGINE_URL = process.env.ML_ENGINE_URL || 'http://localhost:8000';

const POSITIVE_WORDS = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'happy', 'nice'];
const NEGATIVE_WORDS = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor', 'sad', 'angry', 'disappointed'];

// Create axios instance with defaults
const mlClient = axios.create({
  baseURL: ML_ENGINE_URL,
  timeout: 300000, // 5 minute timeout (for model download/heavy processing)
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Check ML Engine health
 */
const checkHealth = async () => {
  try {
    const response = await mlClient.get('/health');
    return response.data;
  } catch (error) {
    logger.error(`ML Engine health check failed: ${error.message}`);
    throw new Error('ML Engine is not available');
  }
};

const heuristicAnalyze = (text = '') => {
  const safeText = String(text || '');
  const tokens = safeText.toLowerCase().split(/\W+/).filter(Boolean);

  let pos = 0;
  let neg = 0;
  for (const token of tokens) {
    if (POSITIVE_WORDS.includes(token)) pos += 1;
    if (NEGATIVE_WORDS.includes(token)) neg += 1;
  }

  let sentiment = 'neutral';
  if (pos > neg) sentiment = 'positive';
  else if (neg > pos) sentiment = 'negative';

  const total = Math.max(1, pos + neg);
  const sentimentScore = Math.min(0.99, Math.max(0.5, (Math.max(pos, neg) / total)));

  return {
    text: safeText,
    sentiment,
    sentiment_score: sentimentScore,
    confidence: 0.55,
    emotions: [{ emotion: 'neutral', score: 1 }],
    dominant_emotion: 'neutral',
    summary: null
  };
};

/**
 * Analyze single text
 */
const analyzeText = async (text) => {
  try {
    const startTime = Date.now();

    const response = await mlClient.post('/analyze', { text });

    const processingTime = Date.now() - startTime;

    logger.info(`Text analyzed in ${processingTime}ms`);

    return {
      ...response.data,
      processingTime
    };
  } catch (error) {
    logger.error(`ML analysis failed: ${error.message}`);

    if (error.response) {
      throw new Error(error.response.data?.detail || 'Analysis failed');
    }

    logger.warn('Falling back to heuristic sentiment analysis');
    return {
      ...heuristicAnalyze(text),
      processingTime: 0
    };
  }
};

/**
 * Analyze multiple texts (batch)
 */
const analyzeBatch = async (texts) => {
  try {
    const startTime = Date.now();

    const response = await mlClient.post('/analyze/batch', { texts });

    const processingTime = Date.now() - startTime;

    logger.info(`Batch of ${texts.length} texts analyzed in ${processingTime}ms`);

    return {
      ...response.data,
      processingTime
    };
  } catch (error) {
    logger.error(`ML batch analysis failed: ${error.message}`);

    if (error.response) {
      throw new Error(error.response.data?.detail || 'Batch analysis failed');
    }

    logger.warn('Falling back to heuristic batch sentiment analysis');
    const results = texts.map((text) => heuristicAnalyze(text));
    return {
      results,
      total: results.length,
      processingTime: 0
    };
  }
};

/**
 * Transform ML result to database format
 */
const transformResult = (mlResult) => {
  return {
    text: mlResult.text,
    sentiment: mlResult.sentiment,
    sentimentScore: mlResult.sentiment_score,
    confidence: mlResult.confidence,
    emotions: mlResult.emotions,
    dominantEmotion: mlResult.dominant_emotion,
    summary: mlResult.summary
  };
};

module.exports = {
  checkHealth,
  analyzeText,
  analyzeBatch,
  transformResult
};
