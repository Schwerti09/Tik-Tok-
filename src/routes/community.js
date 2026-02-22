const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// Dedicated sub-routers for standalone mounts at /api/posts and /api/mentors
const postsRouter = express.Router();
const mentorsRouter = express.Router();

// GET /api/community/posts – list forum posts
router.get('/posts', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(count)')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/community/posts – create new post
router.post('/posts', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id: req.user.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/community/posts/:id/comments – add comment to post
router.post('/posts/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id: req.user.id, post_id: req.params.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/community/mentors – list available mentors
router.get('/mentors', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// List posts
postsRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(count)')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create post
postsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id: req.user.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Add comment to post
postsRouter.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id: req.user.id, post_id: req.params.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// List mentors
mentorsRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports.postsRouter = postsRouter;
module.exports.mentorsRouter = mentorsRouter;
