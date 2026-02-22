const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// POST /api/ideas/generate – return 10 placeholder video concept stubs
router.post('/generate', authMiddleware, async (req, res, next) => {
  try {
    const { keyword = '', niche = '' } = req.body;
    const concepts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `${niche ? `[${niche}] ` : ''}Video Concept #${i + 1}: ${keyword}`,
      description: `An engaging short-form video about "${keyword}" targeting the ${niche || 'general'} audience. Focus on storytelling and trending audio.`,
      hashtags: [
        `#${keyword.replace(/\s+/g, '')}`,
        `#${niche.replace(/\s+/g, '') || 'trending'}`,
        '#TikTok',
        '#ForYou',
        '#CreatorTips'
      ],
      estimatedViews: Math.floor(Math.random() * 450000) + 50000
    }));
    res.json(concepts);
  } catch (err) {
    next(err);
  }
});

// GET /api/ideas – fetch saved ideas for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/ideas/save – save an idea for current user
router.post('/save', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert([{ user_id: req.user.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
