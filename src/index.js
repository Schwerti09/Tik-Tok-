require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const trendsRouter = require('./routes/trends');
const ideasRouter = require('./routes/ideas');
const recordingsRouter = require('./routes/recordings');
const videosRouter = require('./routes/videos');
const schedulesRouter = require('./routes/schedules');
const analyticsRouter = require('./routes/analytics');
const communityRouter = require('./routes/community');
const { postsRouter, mentorsRouter } = require('./routes/community');
const stripeRouter = require('./routes/stripe');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api/upload', recordingsRouter);
app.use('/api/recordings', recordingsRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/ideas', ideasRouter);
app.use('/api/videos', videosRouter);
app.use('/api/schedule', schedulesRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/community', communityRouter);
app.use('/api/posts', postsRouter);
app.use('/api/mentors', mentorsRouter);
app.use('/api/stripe', stripeRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
