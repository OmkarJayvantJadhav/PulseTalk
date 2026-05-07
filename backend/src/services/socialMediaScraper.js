/**
 * Social Media Scraper Service
 * Uses Playwright for browser automation to extract content from social media platforms
 */

const { chromium } = require('playwright');
const { logger } = require('../config/logger');

class SocialMediaScraper {
  constructor() {
    this.browser = null;
    this.supportedPlatforms = [
      'youtube.com',
      'youtu.be',
      'twitter.com',
      'x.com',
      'instagram.com',
      'facebook.com',
      'fb.com',
      'reddit.com',
      'linkedin.com',
      'tiktok.com'
    ];
  }

  /**
   * Initialize browser instance
   */
  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      logger.info('Playwright browser initialized');
    }
    return this.browser;
  }

  /**
   * Close browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('Playwright browser closed');
    }
  }

  /**
   * Validate if URL is from a supported platform
   */
  isValidSocialMediaUrl(url) {
    // Also accept generic URLs now for reviews
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect platform from URL
   */
  detectPlatform(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return 'youtube';
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return 'twitter';
      } else if (hostname.includes('instagram.com')) {
        return 'instagram';
      } else if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
        return 'facebook';
      } else if (hostname.includes('reddit.com')) {
        return 'reddit';
      } else if (hostname.includes('linkedin.com')) {
        return 'linkedin';
      } else if (hostname.includes('tiktok.com')) {
        return 'tiktok';
      } else if (hostname.includes('amazon') || hostname.includes('yelp') || hostname.includes('tripadvisor') || hostname.includes('trustpilot')) {
        return 'reviews';
      }

      return 'other';
    } catch (error) {
      return 'other';
    }
  }

  /**
   * Utility: Auto-scroll to load more content
   */
  async autoScroll(page, targetCount = 100, selector = 'body') {
    let scrollAttempts = 0;
    while (scrollAttempts < 15) {
      // Check finding count
      const count = await page.evaluate((sel) => {
        // Heuristic: count elements that look like comments/posts
        if (sel === 'body') return 0; // fallback
        return document.querySelectorAll(sel).length;
      }, selector);

      if (count >= targetCount) break;

      // Scroll
      await page.evaluate(() => window.scrollBy(0, 3000));
      await page.waitForTimeout(1000);

      // Sometimes scroll back up slightly to trigger load
      if (scrollAttempts % 3 === 0) {
        await page.evaluate(() => window.scrollBy(0, -500));
        await page.waitForTimeout(500);
      }

      scrollAttempts++;
    }
  }

  /**
   * Extract content from YouTube
   */
  async extractYouTube(page, url) {
    logger.info(`Extracting YouTube: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Cookie protection
    try {
      const consentButton = await page.$('button[aria-label="Reject all"], button[aria-label="Accept all"], span:text("Reject all"), span:text("Accept all")');
      if (consentButton) {
        await consentButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) { }

    // Initial scroll to trigger comments load
    await page.evaluate(() => window.scrollBy(0, 600));

    // Explicitly wait for comment section
    try {
      await page.waitForSelector('ytd-comments, #comments', { state: 'attached', timeout: 15000 });
    } catch (e) {
      logger.warn('YouTube: Comments section element not found within timeout');
    }

    // Enhanced scroll loop with better detection
    let scrollAttempts = 0;
    let lastCommentCount = 0;
    let stableCount = 0;

    while (scrollAttempts < 20 && stableCount < 3) {
      // Multiple selector attempts for comments
      const commentCount = await page.evaluate(() => {
        // Try multiple modern YouTube selectors
        const selectors = [
          '#content-text', // Most common
          'yt-attributed-string#content-text',
          '#content-text span',
          '[id="content-text"]',
          '.ytd-comment-renderer #content-text',
          'yt-formatted-string#content-text',
          '#comment-content #content-text',
          '.comment-renderer #content-text',
          '[data-testid="comment-content"] #content-text'
        ];

        let maxCount = 0;
        for (const selector of selectors) {
          const count = document.querySelectorAll(selector).length;
          maxCount = Math.max(maxCount, count);
        }
        return maxCount;
      });

      if (commentCount >= 50) break; // Good enough
      if (commentCount === lastCommentCount) {
        stableCount++;
      } else {
        stableCount = 0;
        lastCommentCount = commentCount;
      }

      // Scroll with random delays to appear more human
      await page.evaluate(() => {
        window.scrollBy(0, Math.random() * 2000 + 3000);
      });
      await page.waitForTimeout(1000 + Math.random() * 2000);
      scrollAttempts++;
    }

    const data = await page.evaluate(() => {
      // Modern YouTube title selectors
      const titleSelectors = [
        'h1.ytd-video-primary-info-renderer',
        'yt-formatted-string.ytd-watch-metadata',
        '#title h1',
        'h1.ytd-watch-metadata',
        '.ytd-watch-metadata h1'
      ];

      let title = '';
      for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          title = el.textContent.trim();
          break;
        }
      }
      if (!title) title = document.title.replace(' - YouTube', '');

      // Author/channel name
      const authorSelectors = [
        'ytd-channel-name a',
        '#channel-name a',
        '.ytd-channel-name a',
        '#owner #channel-name',
        'yt-formatted-string.ytd-channel-name'
      ];

      let author = '';
      for (const selector of authorSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          author = el.textContent.trim();
          break;
        }
      }

      // Comprehensive comment extraction
      const commentSelectors = [
        '#content-text',
        'yt-attributed-string#content-text',
        '.ytd-comment-renderer #content-text',
        'yt-formatted-string#content-text',
        '#comment-content #content-text',
        '.comment-renderer #content-text',
        '[data-testid="comment-content"] #content-text',
        '.ytd-comment-thread-renderer #content-text'
      ];

      let allComments = new Set(); // Use Set to avoid duplicates

      for (const selector of commentSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent.trim();
          if (text.length > 3 && text.length < 1000) { // Filter out too short/long comments
            allComments.add(text);
          }
        });
      }

      const comments = Array.from(allComments).slice(0, 100);

      return { title, author, comments };
    });

    if (data.comments.length === 0) {
      throw new Error(`YouTube Scraper Error: Found 0 comments. Selector used? Lazy load failed? Title: ${data.title}`);
    }

    let text = `Video: ${data.title}\n\nKey Comments (${data.comments.length}):\n`;
    text += data.comments.map((c, i) => `${i + 1}) ${c}`).join('\n');

    return {
      text,
      content: data.title,
      comments: data.comments,
      author: data.author,
      platform: 'youtube',
      metadata: { title: data.title, count: data.comments.length }
    };
  }

  /**
   * Extract content from Twitter/X
   */
  async extractTwitter(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Twitter is hard. Try to find tweet text.
    // Loop scroll
    await this.autoScroll(page, 50, '[data-testid="tweet"]');

    const data = await page.evaluate(() => {
      // Modern Twitter selectors
      const tweetSelectors = [
        '[data-testid="tweetText"]',
        '[role="group"] [lang]',
        'article [lang]',
        '[data-testid="Tweet-User-Text"]',
        '.tweet-text',
        '[data-testid="tweet"] [lang]'
      ];

      let allTweets = new Set();

      for (const selector of tweetSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent.trim();
          if (text.length > 5 && text.length < 500) {
            allTweets.add(text);
          }
        });
      }

      const tweets = Array.from(allTweets).slice(0, 100);
      const mainTweet = tweets[0] || '';
      const replies = tweets.slice(1);

      return { mainTweet, replies };
    });

    let text = `Tweet: ${data.mainTweet}\n\nReplies/Thread:\n`;
    text += data.replies.map((c, i) => `${i + 1}) ${c}`).join('\n');

    return {
      text,
      content: data.mainTweet,
      comments: data.replies,
      platform: 'twitter',
      author: '',
      metadata: { count: data.replies.length }
    };
  }

  /**
   * Extract content from Reddit
   */
  async extractReddit(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Auto scroll
    await this.autoScroll(page, 100, 'shreddit-comment');

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const body = document.querySelector('[slot="text-body"]')?.textContent?.trim() || '';

      // shreddit-comment (new UI) or .entry (old UI)
      // We'll look for simple paragraphs inside specific containers
      const comments = Array.from(document.querySelectorAll('div[slot="comment"] p, .usertext-body, shreddit-comment'))
        .slice(0, 100)
        .map(el => el.textContent.trim())
        .filter(Boolean);

      return { title, body, comments };
    });

    let text = `Thread: ${data.title}\n${data.body}\n\nComments:\n`;
    text += data.comments.map((c, i) => `${i + 1}) ${c}`).join('\n');

    return {
      text,
      content: `${data.title}\n${data.body}`.trim(),
      comments: data.comments,
      platform: 'reddit',
      author: '',
      metadata: { title: data.title, count: data.comments.length }
    };
  }

  /**
   * Extract Content from Instagram
   */
  async extractInstagram(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Instagram blocks aggressive scraping. We do best effort.
    // Comments are usually inside ul/li
    // or div with specific roles.

    // Try to click "View more comments"
    try {
      // Selectors like 'button' containing 'View more'
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 500));
        const btns = await page.$$('button');
        for (const btn of btns) {
          const txt = await btn.textContent();
          if (txt && (txt.includes('View more') || txt.includes('Load more'))) {
            await btn.click().catch(() => { });
            await page.waitForTimeout(1000);
          }
        }
      }
    } catch (e) { }

    const data = await page.evaluate(() => {
      // Modern Instagram selectors
      const captionSelectors = [
        '[data-testid="post-comment-root"]',
        'article [role="button"] span',
        '.C4VMK span',
        '[data-testid="caption"]',
        'article span'
      ];

      let caption = '';
      for (const selector of captionSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          caption = el.textContent.trim();
          break;
        }
      }

      // Try to get comments (limited without login)
      const commentSelectors = [
        '[data-testid="comment-text"]',
        '.Mr508 span',
        'article div[role="button"] span'
      ];

      let comments = [];
      for (const selector of commentSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent.trim();
          if (text.length > 3 && text !== caption) {
            comments.push(text);
          }
        });
      }

      return { caption, comments: comments.slice(0, 50) };
    });

    let text = `Instagram Post Comments:\n`;
    if (data.comments && data.comments.length > 0) {
      text += data.comments.map((c, i) => `${i + 1}) ${c}`).join('\n');
    }

    return {
      text,
      content: data.caption,
      comments: data.comments || [],
      platform: 'instagram',
      author: '',
      metadata: { count: (data.comments || []).length }
    };
  }

  /**
    * Extract Reviews (Generic)
    */
  async extractReviews(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await this.autoScroll(page, 100, '[class*="review"], [class*="Review"]');

    const data = await page.evaluate(() => {
      const title = document.title;

      // Schema.org check
      // Look for JSON-LD
      let reviews = [];

      // 1. Try JSON-LD
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        try {
          const json = JSON.parse(script.textContent);
          if (json['@type'] === 'Review' || json.review) {
            const r = json['@type'] === 'Review' ? [json] : json.review;
            if (Array.isArray(r)) {
              r.forEach(rv => {
                if (rv.reviewBody) reviews.push(rv.reviewBody);
              });
            }
          }
        } catch (e) { }
      });

      // 2. Try Heuristic text finding
      // Look for elements with class 'review-text', 'comment-body', 'description'
      if (reviews.length < 5) {
        const potentialElements = document.querySelectorAll('[class*="review-text"], [data-hook="review-body"], .review-content, p[itemprop="reviewBody"]');
        potentialElements.forEach(el => {
          if (el.textContent.length > 10) reviews.push(el.textContent.trim());
        });
      }

      return { title, reviews: reviews.slice(0, 100) };
    });

    let text = `Reviews for: ${data.title}\n\n`;
    let comments = data.reviews || [];
    let content = data.title;

    if (data.reviews.length > 0) {
      text += data.reviews.map((c, i) => `${i + 1}) ${c}`).join('\n');
    } else {
      // Fallback to body text if no reviews found
      text += "Could not isolate specific reviews. Analyzing page text:\n";
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 5000));
      text += bodyText;
      content = bodyText || data.title;
    }

    return {
      text,
      content,
      comments,
      platform: 'review-site',
      author: '',
      metadata: { count: comments.length, title: data.title }
    };
  }

  /**
   * Main scraping method - Router
   */
  async scrapeUrl(url) {
    if (!this.isValidSocialMediaUrl(url)) {
      throw new Error('Invalid URL');
    }

    const platform = this.detectPlatform(url);
    logger.info(`Scraping ${platform} URL: ${url}`);

    let browser;
    let context;
    let page;
    let result;

    try {
      browser = await this.initBrowser();
      context = await browser.newContext({
        userAgent: 'Mozilla/5.0 ({os_info}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'.replace('{os_info}', 'Windows NT 10.0; Win64; x64')
      });
      page = await context.newPage();

      switch (platform) {
        case 'youtube':
          result = await this.extractYouTube(page, url);
          break;
        case 'twitter':
          result = await this.extractTwitter(page, url);
          break;
        case 'reddit':
          result = await this.extractReddit(page, url);
          break;
        case 'instagram':
          result = await this.extractInstagram(page, url);
          break;
        case 'reviews': // Smart generic reviews
          result = await this.extractReviews(page, url);
          break;
        default:
          // Try generic review extraction for "other" too, if "other" looks like a review site?
          // Or just generic text.
          // Let's force generic text for fallback
          result = await this.extractReviews(page, url); // Use review extractor as advanced fallback
          if (result.metadata.count === 0) {
            // Really fallback
            const text = await page.evaluate(() => document.body.innerText.slice(0, 5000));
            const title = await page.title();
            result = { text, content: text, comments: [], platform: 'web-generic', author: '', metadata: { title } };
          }
      }

      await context.close();

      if (!result.text || result.text.length < 50) {
        throw new Error('Insufficient content extracted.');
      }

      return {
        ...result,
        sourceUrl: url,
        extractedAt: new Date()
      };

    } catch (error) {
      if (context) await context.close();
      logger.error(`Scraping error: ${error.message}`);
      throw error;
    }
  }
}

const scraperInstance = new SocialMediaScraper();

process.on('exit', async () => {
  await scraperInstance.closeBrowser();
});
process.on('SIGINT', async () => {
  await scraperInstance.closeBrowser();
  process.exit(0);
});

module.exports = scraperInstance;
