/* tikflow/shared/types.js */
// Gemeinsame Typdefinitionen als JSDoc-Kommentare für Frontend und Backend.
// Solange das Projekt noch JavaScript nutzt, dienen diese Kommentare als
// lebende Dokumentation und können bei einer TypeScript-Migration direkt
// in .ts-Interfaces überführt werden.

/**
 * @typedef {'free'|'creator'|'pro'|'business'} SubscriptionTier
 */

/**
 * @typedef {Object} Profile
 * @property {string}           id                - UUID (Supabase Auth User-ID)
 * @property {string}           [username]
 * @property {string}           [full_name]
 * @property {string}           [avatar_url]
 * @property {string[]}         [niche]
 * @property {SubscriptionTier} subscription_tier
 * @property {string}           [stripe_customer_id]
 * @property {string}           created_at
 */

/**
 * @typedef {Object} Trend
 * @property {string} id
 * @property {string} title
 * @property {string} [type]        - 'sound' | 'hashtag' | 'aesthetic'
 * @property {string} [niche]
 * @property {Object} [engagement]  - { views, likes, shares }
 * @property {string} detected_at
 */

/**
 * @typedef {Object} Idea
 * @property {string}   id
 * @property {string}   user_id
 * @property {string}   title
 * @property {string}   [description]
 * @property {string[]} [hashtags]
 * @property {string}   created_at
 */

/**
 * @typedef {Object} GeneratedIdea
 * @property {number}   id
 * @property {string}   title
 * @property {string}   description
 * @property {string[]} hashtags
 * @property {number}   estimatedViews
 */

/**
 * @typedef {'tiktok'|'instagram'|'youtube'} Platform
 */

/**
 * @typedef {'pending'|'posted'|'failed'} ScheduleStatus
 */

/**
 * @typedef {Object} Schedule
 * @property {string}         id
 * @property {string}         user_id
 * @property {Platform}       platform
 * @property {string}         [video_url]
 * @property {string}         [caption]
 * @property {string}         scheduled_at
 * @property {ScheduleStatus} status
 * @property {string}         created_at
 */

/**
 * @typedef {Object} Recording
 * @property {string} id
 * @property {string} user_id
 * @property {string} file_name
 * @property {string} [original_name]
 * @property {string} [mime_type]
 * @property {number} [size]
 * @property {string} created_at
 */

/**
 * @typedef {'pending'|'processing'|'completed'|'failed'} JobStatus
 */

/**
 * @typedef {Object} Job
 * @property {string}    id
 * @property {string}    user_id
 * @property {string}    [video_url]
 * @property {Object}    [options]
 * @property {JobStatus} status
 * @property {string}    [output_path]
 * @property {string}    created_at
 */

/**
 * @typedef {Object} AnalyticsOverview
 * @property {string} user_id
 * @property {number} total_revenue
 * @property {number} total_videos
 * @property {number} total_views
 * @property {number} subscribers
 */

/**
 * @typedef {Object} Sale
 * @property {string} id
 * @property {string} user_id
 * @property {number} amount
 * @property {string} [utm_source]
 * @property {string} [utm_medium]
 * @property {string} [utm_campaign]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} user_id
 * @property {string} content
 * @property {string} created_at
 * @property {{ count: number }[]} [comments]
 */

/**
 * @typedef {Object} Mentor
 * @property {string}  id
 * @property {string}  name
 * @property {string}  [bio]
 * @property {string}  [niche]
 * @property {boolean} available
 * @property {string}  created_at
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error
 */

module.exports = {};
