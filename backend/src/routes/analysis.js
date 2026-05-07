/**
 * Analysis Routes
 */

const express = require('express');
const router = express.Router();

const { Analysis, User } = require('../models');
const { mlService, socialMediaScraper } = require('../services');
const { authenticate, analysisValidation } = require('../middleware');
const { logger } = require('../config/logger');

/**
 * POST /api/analysis
 * Create new analysis
 */
router.post('/', authenticate, analysisValidation.create, async (req, res, next) => {
  try {
    const { text, title, description, tags } = req.body;
    const userId = req.userId;

    // Check credits
    const user = await User.findById(userId);
    if (user.analysisCredits <= 0) {
      return res.status(402).json({
        error: 'Payment Required',
        message: 'Insufficient analysis credits'
      });
    }

    // Call ML Engine
    const mlResult = await mlService.analyzeText(text);

    // Transform and save result
    const analysis = new Analysis({
      user: userId,
      title,
      description,
      inputText: text,
      result: mlService.transformResult(mlResult),
      tags,
      metadata: {
        processingTime: mlResult.processingTime,
        modelVersion: '1.0.0',
        source: 'web'
      }
    });

    await analysis.save();

    // Update user stats
    user.analysisCredits -= 1;
    user.totalAnalyses += 1;
    await user.save();

    logger.info(`Analysis created: ${analysis._id} for user ${userId}`);

    res.status(201).json({
      message: 'Analysis complete',
      analysis: analysis.toJSON(),
      remainingCredits: user.analysisCredits
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/analysis/url
 * Create analysis from social media URL
 */
router.post('/url', authenticate, analysisValidation.createFromUrl, async (req, res, next) => {
  const startTime = Date.now();

  try {
    const { url, title, description } = req.body;
    const userId = req.userId;
    const URL_ANALYSIS_COST = 3; // Credits for URL-based analysis

    // Check credits
    const user = await User.findById(userId);
    if (user.analysisCredits < URL_ANALYSIS_COST) {
      return res.status(402).json({
        error: 'Payment Required',
        message: `Insufficient credits. URL analysis requires ${URL_ANALYSIS_COST} credits, you have ${user.analysisCredits}`
      });
    }

    logger.info(`URL analysis requested by user ${userId}: ${url}`);

    // Scrape content from URL
    let scrapedData;
    try {
      scrapedData = await socialMediaScraper.scrapeUrl(url);
    } catch (scrapeError) {
      logger.error(`Scraping failed for ${url}: ${scrapeError.message}`);
      // Graceful fallback: continue with URL text instead of failing the request.
      scrapedData = {
        text: `Content from URL: ${url}`,
        content: `Content from URL: ${url}`,
        comments: [],
        author: '',
        platform: 'other',
        extractedAt: new Date(),
        metadata: {
          mode: 'scrape-fallback',
          error: scrapeError.message
        }
      };
    }

    // Call ML Engine with extracted text
    let mainResult;
    let commentsAnalyzed = 0;
    let batchResults = [];
    
    // Fallback if the scraper fails to extract distinct comments
    if (!scrapedData.comments || scrapedData.comments.length === 0) {
      const mlResult = await mlService.analyzeText(scrapedData.text);
      mainResult = mlService.transformResult(mlResult);
    } else {
      // Analyze the main content to get a summary
      const contentAnalysis = await mlService.analyzeText(scrapedData.content || scrapedData.text || url);
      const summary = contentAnalysis.summary;
      
      // Limit to top 15 comments for faster processing
      const topComments = (scrapedData.comments || []).slice(0, 15);
      
      // Batch analyze top comments
      const batchResult = await mlService.analyzeBatch(topComments);
      commentsAnalyzed = batchResult.total || 0;
      
      // Transform batch results
      batchResults = batchResult.results.map(mlService.transformResult);
      
      // Aggregate the results
      let totalSentimentScore = 0;
      let totalConfidence = 0;
      let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      let emotionCounts = {};
      
      batchResults.forEach(r => {
        totalSentimentScore += r.sentimentScore;
        totalConfidence += r.confidence;
        sentimentCounts[r.sentiment]++;
        
        r.emotions.forEach(e => {
          emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.score;
        });
      });
      
      // Calculate averages
      const divisor = Math.max(1, commentsAnalyzed);
      const avgSentimentScore = totalSentimentScore / divisor;
      const avgConfidence = totalConfidence / divisor;
      
      // Determine overall sentiment (majority vote)
      const majoritySentiment = Object.keys(sentimentCounts).reduce((a, b) => 
        sentimentCounts[a] > sentimentCounts[b] ? a : b
      );
      
      // Format emotions
      const emotions = Object.keys(emotionCounts).map(emotion => ({
        emotion,
            score: emotionCounts[emotion] / divisor
      })).sort((a, b) => b.score - a.score);
      
      mainResult = {
        text: scrapedData.text,
        sentiment: majoritySentiment,
        sentimentScore: avgSentimentScore,
        confidence: avgConfidence,
        dominantEmotion: emotions.length > 0 ? emotions[0].emotion : 'neutral',
        emotions: emotions,
        summary: summary || `Analyzed ${commentsAnalyzed} comments from ${scrapedData.platform}.`
      };
    }

    // Transform and save result
    const analysis = new Analysis({
      user: userId,
      title: title || `${scrapedData.platform || 'url'} Analysis - ${new Date().toLocaleDateString()}`,
      description,
      inputText: scrapedData.text || `Content from URL: ${url}`,
      sourceUrl: url,
      platform: scrapedData.platform || 'other',
      urlAnalysisCost: URL_ANALYSIS_COST,
      result: mainResult,
      isBatch: batchResults.length > 0,
      batchResults: batchResults,
      metadata: {
        processingTime: Date.now() - startTime,
        modelVersion: '1.0.0',
        source: 'social-media',
        author: scrapedData.author || '',
        extractedAt: scrapedData.extractedAt,
        commentsAnalyzed,
        ...scrapedData.metadata
      }
    });

    await analysis.save();

    // Update user stats
    user.analysisCredits -= URL_ANALYSIS_COST;
    user.totalAnalyses += 1;
    await user.save();

    logger.info(`URL analysis created: ${analysis._id} for user ${userId} (platform: ${scrapedData.platform})`);

    res.status(201).json({
      message: 'URL analysis complete',
      analysis: analysis.toJSON(),
      remainingCredits: user.analysisCredits,
      creditsUsed: URL_ANALYSIS_COST
    });

  } catch (error) {
    logger.error(`URL analysis error: ${error.message}`);
    res.status(500).json({
      error: 'URL Analysis Failed',
      message: error.message,
      stack: error.stack
    });
  }
});

/**
 * POST /api/analysis/batch
 * Create batch analysis
 */
router.post('/batch', authenticate, analysisValidation.batch, async (req, res, next) => {
  try {
    const { texts, title } = req.body;
    const userId = req.userId;

    // Check credits
    const user = await User.findById(userId);
    if (user.analysisCredits < texts.length) {
      return res.status(402).json({
        error: 'Payment Required',
        message: `Insufficient credits. Need ${texts.length}, have ${user.analysisCredits}`
      });
    }

    // Call ML Engine batch analysis
    const mlResult = await mlService.analyzeBatch(texts);

    // Save each result as separate analysis
    const analyses = await Promise.all(
      mlResult.results.map(async (result, index) => {
        const analysis = new Analysis({
          user: userId,
          title: title ? `${title} - ${index + 1}` : undefined,
          inputText: result.text,
          result: mlService.transformResult(result),
          isBatch: true,
          metadata: {
            processingTime: Math.round(mlResult.processingTime / texts.length),
            modelVersion: '1.0.0',
            source: 'batch'
          }
        });
        await analysis.save();
        return analysis;
      })
    );

    // Update user stats
    user.analysisCredits -= texts.length;
    user.totalAnalyses += texts.length;
    await user.save();

    logger.info(`Batch analysis: ${texts.length} texts for user ${userId}`);

    res.status(201).json({
      message: 'Batch analysis complete',
      total: analyses.length,
      analyses: analyses.map(a => a.toJSON()),
      remainingCredits: user.analysisCredits
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis
 * List user's analyses with pagination
 */
router.get('/', authenticate, analysisValidation.list, async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sentiment = req.query.sentiment;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: userId };
    if (sentiment) {
      query['result.sentiment'] = sentiment;
    }

    // Get analyses with pagination
    const [analyses, total] = await Promise.all([
      Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Analysis.countDocuments(query)
    ]);

    res.json({
      analyses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis/stats
 * Get user's analysis statistics
 */
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.userId;

    const [stats, emotionDistribution, timeline] = await Promise.all([
      Analysis.getUserStats(userId),
      Analysis.getEmotionDistribution(userId),
      Analysis.getTimeline(userId, 30)
    ]);

    res.json({
      stats,
      emotionDistribution,
      timeline
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis/:id
 * Get specific analysis
 */
router.get('/:id', authenticate, analysisValidation.getById, async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    res.json({ analysis });

  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/analysis/:id
 * Delete specific analysis
 */
router.delete('/:id', authenticate, analysisValidation.getById, async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    logger.info(`Analysis deleted: ${req.params.id}`);

    res.json({ message: 'Analysis deleted' });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analysis/:id/export
 * Export analysis as CSV or JSON
 */
router.get('/:id/export', authenticate, analysisValidation.export, async (req, res, next) => {
  try {
    const format = req.query.format || 'json';

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!analysis) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analysis not found'
      });
    }

    if (format === 'csv') {
      // Generate CSV
      const csvLines = [
        'Text,Sentiment,Sentiment Score,Confidence,Dominant Emotion',
        `"${analysis.result.text.replace(/"/g, '""')}",${analysis.result.sentiment},${analysis.result.sentimentScore},${analysis.result.confidence},${analysis.result.dominantEmotion}`
      ];

      // Add emotion details
      csvLines.push('');
      csvLines.push('Emotion,Score');
      analysis.result.emotions.forEach(e => {
        csvLines.push(`${e.emotion},${e.score}`);
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analysis-${analysis._id}.csv`);
      return res.send(csvLines.join('\n'));
    }

    // JSON export
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=analysis-${analysis._id}.json`);
    res.json({
      id: analysis._id,
      createdAt: analysis.createdAt,
      text: analysis.inputText,
      result: analysis.result,
      metadata: analysis.metadata
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
