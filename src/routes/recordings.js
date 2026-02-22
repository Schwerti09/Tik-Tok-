const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload (mounted at /api/upload → path /) or /api/recordings/upload
router.post(['/upload', '/'], authMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileName = `${req.user.id}/${Date.now()}_${req.file.originalname}`;
    const { error: storageError } = await supabase.storage
      .from('recordings')
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (storageError) return res.status(400).json({ error: storageError.message });

    const { data, error } = await supabase
      .from('recordings')
      .insert([{
        user_id: req.user.id,
        file_name: fileName,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        size: req.file.size
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/recordings – list recordings for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recordings/:id – delete recording by id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { data: recording, error: fetchError } = await supabase
      .from('recordings')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !recording) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    await supabase.storage.from('recordings').remove([recording.file_name]);

    const { error } = await supabase
      .from('recordings')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Recording deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
