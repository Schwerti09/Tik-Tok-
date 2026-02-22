const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// GET /api/analytics/overview – fetch overview stats for current user
router.get('/overview', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('analytics_overview')
      .select('*')
      .eq('user_id', req.user.id)
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/videos/:id – fetch per-video analytics
router.get('/videos/:id', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('video_analytics')
      .select('*')
      .eq('video_id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/sales – fetch sales with UTM tracking
router.get('/sales', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
