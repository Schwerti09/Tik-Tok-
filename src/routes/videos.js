const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

// POST /api/videos/process – insert a processing job
router.post('/process', authMiddleware, async (req, res, next) => {
  try {
    const { videoUrl, options = {} } = req.body;
    const { captions = false, reframe = false, highlights = false } = options;

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        user_id: req.user.id,
        video_url: videoUrl,
        options: { captions, reframe, highlights },
        status: 'pending'
      }])
      .select('id')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ jobId: data.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/videos/status/:jobId – fetch job status
router.get('/status/:jobId', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.jobId)
      .eq('user_id', req.user.id)
      .single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/videos – list completed videos for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/videos/:id/download – get download URL from supabase storage
router.get('/:id/download', authMiddleware, async (req, res, next) => {
  try {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (jobError || !job) return res.status(404).json({ error: 'Video not found' });
    if (!job.output_path) return res.status(400).json({ error: 'Video not ready' });

    const { data, error } = await supabase.storage
      .from('videos')
      .createSignedUrl(job.output_path, 3600);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ url: data.signedUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
