/**
 * Credit Check Middleware
 * Verifies user has credits or active subscription before allowing protected actions
 */

const { logger } = require('../config/logger');

/**
 * Middleware to check if user has credits or active subscription
 * If no access, returns 402 Payment Required
 */
const checkCredits = (requiredCredits = 1) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      // Check if user has active subscription
      const hasActiveSubscription = user.subscriptionStatus === 'active' && 
                                    user.subscriptionExpiresAt > new Date();

      // Check if user has active trial
      const hasActiveTrial = user.subscriptionStatus === 'trial' && 
                            user.trialEndedAt > new Date();

      // If subscription is active, no credit consumption
      if (hasActiveSubscription) {
        logger.debug(`User ${user.email} has active subscription`);
        return next();
      }

      // If trial is active, check credits
      if (hasActiveTrial) {
        if (user.analysisCredits >= requiredCredits) {
          logger.debug(`User ${user.email} has sufficient trial credits: ${user.analysisCredits}`);
          return next();
        } else {
          logger.warn(`User ${user.email} has insufficient trial credits: ${user.analysisCredits}`);
          return res.status(402).json({
            error: 'Payment Required',
            message: 'Insufficient credits. Please purchase a subscription or upgrade your plan.',
            creditsAvailable: user.analysisCredits,
            creditsRequired: requiredCredits
          });
        }
      }

      // Trial expired or no subscription
      if (user.subscriptionStatus === 'trial') {
        logger.warn(`User ${user.email} trial expired`);
        return res.status(402).json({
          error: 'Payment Required',
          message: 'Your trial has expired. Please purchase a subscription to continue.',
          status: 'trial_expired'
        });
      }

      // No trial or subscription
      logger.warn(`User ${user.email} has no active access`);
      return res.status(402).json({
        error: 'Payment Required',
        message: 'Please choose a plan to access this feature.',
        status: 'no_access'
      });

    } catch (error) {
      logger.error(`Credit check error: ${error.message}`);
      next(error);
    }
  };
};

module.exports = {
  checkCredits
};
