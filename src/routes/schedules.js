const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// POST /api/schedule or /api/schedules/schedule – create a scheduled post
router.post('/schedule', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .insert([{ user_id: req.user.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/schedules – list schedules for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', req.user.id)
      .order('scheduled_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/schedules/:id – update a schedule
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/schedules/:id – delete a schedule
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
