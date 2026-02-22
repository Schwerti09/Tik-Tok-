/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {'free'|'pro'|'enterprise'} plan
 * @property {string|null} avatar
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TrendSound
 * @property {number|string} id
 * @property {string} name
 * @property {string} plays
 * @property {number} growth
 * @property {'tiktok'|'instagram'|'youtube'} platform
 */

/**
 * @typedef {Object} TrendHashtag
 * @property {number|string} id
 * @property {string} name
 * @property {string} posts
 * @property {string} engagement
 * @property {'tiktok'|'instagram'|'youtube'} platform
 */

/**
 * @typedef {Object} TrendAesthetic
 * @property {number|string} id
 * @property {string} name
 * @property {string} description
 * @property {'tiktok'|'instagram'|'youtube'} platform
 */

/**
 * @typedef {Object} TrendsData
 * @property {TrendSound[]} sounds
 * @property {TrendHashtag[]} hashtags
 * @property {TrendAesthetic[]} aesthetics
 */

/**
 * @typedef {Object} VideoIdea
 * @property {string} title
 * @property {string} hook
 * @property {string[]} storyboard
 * @property {string[]} recommendedSounds
 * @property {string[]} recommendedHashtags
 * @property {number} estimatedViews
 */

/**
 * @typedef {Object} ScheduledPost
 * @property {string|number} id
 * @property {'tiktok'|'instagram'|'youtube'} platform
 * @property {string} caption
 * @property {string} scheduledAt  ISO date string
 * @property {string|null} [thumbnail]
 * @property {string|null} [videoUrl]
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {number} totalViews
 * @property {number} totalLikes
 * @property {number} totalFollowers
 * @property {number} estimatedRevenue
 * @property {Array<{title:string, views:number, likes:number, platform:string}>} topPosts
 * @property {string[]} suggestions
 */

/**
 * @typedef {Object} VideoProcessingJob
 * @property {string} jobId
 * @property {'queued'|'processing'|'done'|'error'} status
 * @property {string[]} options
 * @property {string} createdAt
 */

module.exports = {};
