/**
 * Unit tests for the video processing pipeline functions.
 *
 * All external dependencies (pg, S3, ffmpeg) are mocked so no real
 * infrastructure is needed to run these tests.
 */

// ── Mock dependencies before requiring any module under test ─────────────────

// Mock pg Pool
const mockQuery = jest.fn();
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({ query: mockQuery })),
}));

// Mock S3 utilities
jest.mock('../src/utils/s3', () => ({
  uploadToS3: jest.fn(),
  downloadFromS3: jest.fn(),
  getPresignedDownloadUrl: jest.fn(),
  deleteFromS3: jest.fn(),
}));

// Mock fluent-ffmpeg
const mockFfmpegRun = jest.fn();
const mockFfmpegOn = jest.fn();
const mockOutput = jest.fn();
const mockOutputOptions = jest.fn();
jest.mock('fluent-ffmpeg', () => {
  const builder = () => ({
    outputOptions: mockOutputOptions,
    output: mockOutput,
    on: mockFfmpegOn,
    run: mockFfmpegRun,
  });
  mockOutputOptions.mockReturnThis = () => builder;
  mockOutput.mockReturnThis = () => builder;
  mockFfmpegOn.mockReturnThis = () => builder;
  return builder;
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const { createJob, getJob, markJobProcessing, markJobDone, markJobFailed } =
  require('../src/utils/db');

// ── DB utility tests ──────────────────────────────────────────────────────────

describe('src/utils/db', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createJob inserts a row and returns it', async () => {
    const fakeRow = { id: 'job-1', status: 'pending', input_url: 'https://s3/key' };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });

    const result = await createJob('job-1', 'https://s3/key');

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO video_jobs/i);
    expect(params).toEqual(['job-1', 'https://s3/key']);
    expect(result).toEqual(fakeRow);
  });

  test('getJob returns null when no row found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await getJob('missing-id');
    expect(result).toBeNull();
  });

  test('getJob returns the row when found', async () => {
    const fakeRow = { id: 'job-2', status: 'processing' };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });
    const result = await getJob('job-2');
    expect(result).toEqual(fakeRow);
  });

  test('markJobProcessing updates status to processing', async () => {
    const fakeRow = { id: 'job-3', status: 'processing' };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });
    const result = await markJobProcessing('job-3');
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/status = 'processing'/);
    expect(params[0]).toBe('job-3');
    expect(result).toEqual(fakeRow);
  });

  test('markJobDone updates status to done with clip URLs', async () => {
    const clipUrls = ['https://s3/clip_000.mp4', 'https://s3/clip_001.mp4'];
    const fakeRow = { id: 'job-4', status: 'done', clip_urls: clipUrls };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });
    const result = await markJobDone('job-4', clipUrls);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/status = 'done'/);
    expect(params[0]).toBe('job-4');
    expect(JSON.parse(params[1])).toEqual(clipUrls);
    expect(result).toEqual(fakeRow);
  });

  test('markJobFailed updates status to failed with error message', async () => {
    const fakeRow = { id: 'job-5', status: 'failed', error: 'FFmpeg crashed' };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });
    const result = await markJobFailed('job-5', 'FFmpeg crashed');
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/status = 'failed'/);
    expect(params).toEqual(['job-5', 'FFmpeg crashed']);
    expect(result).toEqual(fakeRow);
  });
});

// ── video-status function tests ───────────────────────────────────────────────

describe('netlify/functions/video-status', () => {
  let handler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      handler = require('../netlify/functions/video-status').handler;
    });
  });

  test('returns 405 for non-GET requests', async () => {
    const res = await handler({ httpMethod: 'POST', path: '/api/videos/status/job-1' });
    expect(res.statusCode).toBe(405);
  });

  test('returns 404 when job does not exist', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await handler({
      httpMethod: 'GET',
      path: '/api/videos/status/nonexistent',
    });
    expect(res.statusCode).toBe(404);
  });

  test('returns job data when job exists', async () => {
    const fakeRow = {
      id: 'job-10',
      status: 'done',
      input_url: 'https://s3/source.mp4',
      clip_urls: ['https://s3/clip_000.mp4'],
      error: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:01:00Z',
    };
    mockQuery.mockResolvedValueOnce({ rows: [fakeRow] });
    const res = await handler({
      httpMethod: 'GET',
      path: '/api/videos/status/job-10',
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.jobId).toBe('job-10');
    expect(body.status).toBe('done');
    expect(body.clipUrls).toEqual(['https://s3/clip_000.mp4']);
  });
});
