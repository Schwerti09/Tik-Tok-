const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// GET /api/trends – list trends, optionally filtered by niche
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    let query = supabase.from('trends').select('*');
    if (req.query.niche) {
      query = query.eq('niche', req.query.niche);
    }
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/trends/:id – get single trend by id
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/trends/scan – admin-only
router.post('/scan', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    const { data, error } = await supabase
      .from('scan_requests')
      .insert([{ requested_by: req.user.id, ...req.body }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
