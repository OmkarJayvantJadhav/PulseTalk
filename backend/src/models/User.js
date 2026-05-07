/**
 * User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password by default in queries
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  analysisCredits: {
    type: Number,
    default: 0 // Updated when user chooses trial or subscription
  },
  subscriptionStatus: {
    type: String,
    enum: ['none', 'trial', 'active', 'expired'],
    default: 'none'
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiresAt: {
    type: Date
  },
  trialStartedAt: {
    type: Date
  },
  trialEndedAt: {
    type: Date
  },
  // Trial abuse protection
  registrationIpHash: {
    type: String // Hash of registration IP for fraud detection
  },
  registrationDeviceId: {
    type: String // Device fingerprint for fraud detection
  },
  lastTrialAttemptAt: {
    type: Date
  },
  totalAnalyses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove expired refresh tokens
userSchema.methods.cleanupRefreshTokens = function() {
  this.refreshTokens = this.refreshTokens.filter(
    token => token.expiresAt > new Date()
  );
};

// Add refresh token
userSchema.methods.addRefreshToken = function(token, expiresAt) {
  // Cleanup old tokens first
  this.cleanupRefreshTokens();
  
  // Limit to 5 active refresh tokens per user
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift();
  }
  
  this.refreshTokens.push({ token, expiresAt });
};

// Remove specific refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

// Check if user has active access (trial or subscription)
userSchema.methods.hasActiveAccess = function() {
  if (this.subscriptionStatus === 'active' && this.subscriptionExpiresAt > new Date()) {
    return true;
  }
  if (this.subscriptionStatus === 'trial' && this.trialEndedAt > new Date()) {
    return true;
  }
  return false;
};

// Check if user has sufficient credits
userSchema.methods.hasCredits = function(amount = 1) {
  return this.analysisCredits >= amount;
};

// Decrement credits
userSchema.methods.decrementCredits = function(amount = 1) {
  this.analysisCredits = Math.max(0, this.analysisCredits - amount);
  return this.analysisCredits;
};

// Increment credits (for purchases)
userSchema.methods.incrementCredits = function(amount) {
  this.analysisCredits += amount;
  return this.analysisCredits;
};

// Check if trial is expired
userSchema.methods.isTrialExpired = function() {
  return this.subscriptionStatus === 'trial' && this.trialEndedAt <= new Date();
};

// toJSON transform
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
