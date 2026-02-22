const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// Shared handlers
async function listPosts(req, res, next) {
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
}

async function createPost(req, res, next) {
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
}

async function addComment(req, res, next) {
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
}

async function listMentors(req, res, next) {
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
}

// Community-prefixed routes (/api/community/posts, /api/community/mentors)
router.get('/posts', listPosts);
router.post('/posts', authMiddleware, createPost);
router.post('/posts/:id/comments', authMiddleware, addComment);
router.get('/mentors', listMentors);

// Sub-routers for standalone mounts at /api/posts and /api/mentors
const postsRouter = express.Router();
postsRouter.get('/', listPosts);
postsRouter.post('/', authMiddleware, createPost);
postsRouter.post('/:id/comments', authMiddleware, addComment);

const mentorsRouter = express.Router();
mentorsRouter.get('/', listMentors);

module.exports = router;
module.exports.postsRouter = postsRouter;
module.exports.mentorsRouter = mentorsRouter;
