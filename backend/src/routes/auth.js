/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();

const { User } = require('../models');
const { authService } = require('../services');
const { authenticate, authValidation } = require('../middleware');
const { logger } = require('../config/logger');

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

/**
 * POST /api/auth/register
 * Create new user account
 */
router.post('/register', authValidation.register, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({ email, password, name });
    
    // Generate tokens
    const { accessToken, refreshToken, expiresAt } = authService.generateTokenPair(user._id);
    
    // Save refresh token
    user.addRefreshToken(refreshToken, expiresAt);
    await user.save();

    logger.info(`New user registered: ${email}`);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', authValidation.login, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken, expiresAt } = authService.generateTokenPair(user._id);
    
    // Save refresh token and update last login
    user.addRefreshToken(refreshToken, expiresAt);
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Exchange refresh token for new access token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = authService.verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    // Find user and check if token exists
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    // Check if refresh token is still valid
    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    
    if (!tokenExists) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Refresh token revoked'
      });
    }

    // Remove old refresh token
    user.removeRefreshToken(refreshToken);

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken, expiresAt } = 
      authService.generateTokenPair(user._id);

    // Save new refresh token
    user.addRefreshToken(newRefreshToken, expiresAt);
    await user.save();

    // Set new refresh token cookie
    setRefreshCookie(res, newRefreshToken);

    res.json({
      message: 'Token refreshed',
      accessToken
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Invalidate refresh token
 */
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      // Verify and remove refresh token
      try {
        const decoded = authService.verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);
        
        if (user) {
          user.removeRefreshToken(refreshToken);
          await user.save();
        }
      } catch (error) {
        // Token might be invalid, but we still want to clear the cookie
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: req.user.toJSON()
  });
});

module.exports = router;
