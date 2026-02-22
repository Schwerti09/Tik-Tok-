/**
 * @fileoverview Shared JSDoc type definitions for TikFlow.
 * These types are used across frontend and Netlify functions.
 */

/**
 * @typedef {Object} Trend
 * @property {string} id - Unique trend identifier
 * @property {string} name - Trend name or hashtag
 * @property {string} category - Content category (e.g., Lifestyle, Beauty)
 * @property {string} growth - Growth percentage string (e.g., '+234%')
 * @property {'tiktok'|'instagram'|'youtube'} platform - Source platform
 * @property {string[]} hashtags - Related hashtags
 * @property {string[]} sounds - Trending audio tracks
 */

/**
 * @typedef {Object} VideoIdea
 * @property {string} title - Video title
 * @property {string} hook - Opening hook line
 * @property {string[]} storyboard - Ordered list of storyboard steps
 * @property {string[]} sounds - Recommended sounds
 * @property {string[]} hashtags - Recommended hashtags
 * @property {string} duration - Recommended duration (e.g., '30-60 seconds')
 */

/**
 * @typedef {Object} IdeaGenRequest
 * @property {string} niche - Content niche or topic
 * @property {string} [targetAudience] - Intended target audience
 * @property {string} [style] - Content style (e.g., Educational, Entertaining)
 * @property {string} [platform] - Target platform
 */

/**
 * @typedef {Object} ScheduledPost
 * @property {string} id - Unique post identifier
 * @property {'TikTok'|'Instagram'|'YouTube'} platform - Target platform
 * @property {string} caption - Post caption with hashtags
 * @property {string} scheduledAt - ISO 8601 datetime string
 * @property {'scheduled'|'published'|'failed'} status - Post status
 * @property {string} [createdAt] - ISO 8601 creation timestamp
 */

/**
 * @typedef {Object} KPIMetric
 * @property {string} label - Metric label
 * @property {number|string} value - Current value
 * @property {number|string} prev - Previous period value
 * @property {string} icon - Emoji icon
 * @property {boolean} [raw] - If true, value is already formatted
 */

/**
 * @typedef {Object} PostPerformance
 * @property {string} title - Post title
 * @property {string} platform - Platform name
 * @property {number} views - Total views
 * @property {number} clicks - Total link clicks
 * @property {string} ctr - Click-through rate string (e.g., '2.73%')
 * @property {string} date - ISO date string
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {KPIMetric[]} kpi - KPI metric cards
 * @property {PostPerformance[]} posts - Individual post performance
 * @property {string} [startDate] - Query start date
 * @property {string} [endDate] - Query end date
 * @property {string} fetchedAt - ISO timestamp of data fetch
 */

/**
 * @typedef {Object} VideoProcessingJob
 * @property {string} jobId - Unique job identifier
 * @property {'queued'|'processing'|'completed'|'failed'} status - Job status
 * @property {string[]} operations - Processing operations requested
 * @property {string} estimatedTime - Human-readable time estimate
 * @property {string} queuedAt - ISO timestamp
 */

/**
 * @typedef {Object} User
 * @property {string} id - Supabase user UUID
 * @property {string} email - User email
 * @property {Object} user_metadata - Supabase user metadata
 * @property {string} [user_metadata.full_name] - User's full name
 */

module.exports = {};
