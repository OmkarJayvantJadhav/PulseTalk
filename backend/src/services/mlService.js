/**
 * ML Engine Service
 * Handles communication with FastAPI ML Engine
 */

const axios = require('axios');
const { logger } = require('../config/logger');

const ML_ENGINE_URL = process.env.ML_ENGINE_URL || 'http://localhost:8000';

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

    if (error.code === 'ECONNREFUSED') {
      throw new Error('ML Engine is not available');
    }

    throw new Error('Analysis failed');
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

    if (error.code === 'ECONNREFUSED') {
      throw new Error('ML Engine is not available');
    }

    throw new Error('Batch analysis failed');
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
