/**
 * Analysis Model
 */

const mongoose = require('mongoose');

const emotionScoreSchema = new mongoose.Schema({
  emotion: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, { _id: false });

const analysisResultSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 15000
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  sentimentScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  emotions: [emotionScoreSchema],
  dominantEmotion: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: false
  }
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
    default: function () {
      return `Analysis ${new Date().toLocaleDateString()}`;
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  inputText: {
    type: String,
    required: true,
    maxlength: 10000 // Increased for social media content
  },
  sourceUrl: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  platform: {
    type: String,
    enum: ['youtube', 'twitter', 'instagram', 'facebook', 'reddit', 'linkedin', 'tiktok', 'other'],
    required: false
  },
  urlAnalysisCost: {
    type: Number,
    default: 1 // Will be 3 for URL-based analyses
  },
  result: {
    type: analysisResultSchema,
    required: true
  },
  isBatch: {
    type: Boolean,
    default: false
  },
  batchResults: [analysisResultSchema],
  metadata: {
    processingTime: Number, // in milliseconds
    modelVersion: String,
    source: {
      type: String,
      enum: ['web', 'api', 'batch', 'social-media'],
      default: 'web'
    },
    author: String, // Social media author/username
    postDate: Date, // Original post date if available
    extractedAt: Date // When content was extracted
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Indexes
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ 'result.sentiment': 1 });
analysisSchema.index({ createdAt: -1 });

// Virtual for formatted date
analysisSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to get user stats
analysisSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        positive: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'positive'] }, 1, 0] }
        },
        negative: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'negative'] }, 1, 0] }
        },
        neutral: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'neutral'] }, 1, 0] }
        },
        avgConfidence: { $avg: '$result.confidence' },
        avgSentimentScore: { $avg: '$result.sentimentScore' }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    avgConfidence: 0,
    avgSentimentScore: 0
  };
};

// Static method to get emotion distribution
analysisSchema.statics.getEmotionDistribution = async function (userId) {
  const distribution = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$result.emotions' },
    {
      $group: {
        _id: '$result.emotions.emotion',
        avgScore: { $avg: '$result.emotions.score' },
        count: { $sum: 1 }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);

  return distribution;
};

// Static method to get timeline data
analysisSchema.statics.getTimeline = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const timeline = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 },
        avgSentiment: { $avg: '$result.sentimentScore' },
        positive: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'positive'] }, 1, 0] }
        },
        negative: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'negative'] }, 1, 0] }
        },
        neutral: {
          $sum: { $cond: [{ $eq: ['$result.sentiment', 'neutral'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return timeline;
};

// toJSON transform
analysisSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
