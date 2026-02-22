/**
 * Tests for netlify/functions/virality-score.js
 *
 * The global fetch is mocked so no real Hugging Face calls are made.
 */

"use strict";

const { handler } = require("../netlify/functions/virality-score");

// ── Mock global fetch ────────────────────────────────────────────────────────
global.fetch = jest.fn();

function mockHfResponse(data) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

function mockHfError(status, text) {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => text,
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const SEG = (id, text) => ({ id, start: id * 5, end: id * 5 + 5, text });

const JOY_EMOTIONS = [[{ label: "joy", score: 0.95 }, { label: "neutral", score: 0.05 }]];
const NEUTRAL_EMOTIONS = [[{ label: "neutral", score: 1.0 }]];

// ── Tests ────────────────────────────────────────────────────────────────────
describe("virality-score", () => {
  beforeEach(() => {
    process.env.HUGGINGFACE_API_KEY = "hf-test";
    global.fetch.mockReset();
  });

  afterEach(() => {
    delete process.env.HUGGINGFACE_API_KEY;
  });

  test("returns 405 for non-POST requests", async () => {
    const res = await handler({ httpMethod: "GET" });
    expect(res.statusCode).toBe(405);
  });

  test("returns 400 when body is invalid JSON", async () => {
    const res = await handler({ httpMethod: "POST", body: "{bad" });
    expect(res.statusCode).toBe(400);
  });

  test("returns 400 when segments is missing or empty", async () => {
    const res = await handler({ httpMethod: "POST", body: JSON.stringify({ segments: [] }) });
    expect(res.statusCode).toBe(400);
  });

  test("returns 500 when HUGGINGFACE_API_KEY is not set", async () => {
    delete process.env.HUGGINGFACE_API_KEY;
    const res = await handler({
      httpMethod: "POST",
      body: JSON.stringify({ segments: [SEG(0, "Hello")] }),
    });
    expect(res.statusCode).toBe(500);
  });

  test("scores segments and returns highlights sorted by viralityScore", async () => {
    // seg 0 → joy (high), seg 1 → neutral (low)
    mockHfResponse(JOY_EMOTIONS);
    mockHfResponse(NEUTRAL_EMOTIONS);

    const res = await handler({
      httpMethod: "POST",
      body: JSON.stringify({ segments: [SEG(0, "Amazing!"), SEG(1, "Hmm.")], topN: 1 }),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.segments).toHaveLength(2);
    expect(body.highlights).toHaveLength(1);
    // The joy segment should be ranked first
    expect(body.highlights[0].id).toBe(0);
    expect(body.highlights[0].viralityScore).toBeGreaterThan(body.segments[1].viralityScore);
  });

  test("handles empty-text segments gracefully (score 0)", async () => {
    const res = await handler({
      httpMethod: "POST",
      body: JSON.stringify({ segments: [SEG(0, "")], topN: 1 }),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.segments[0].viralityScore).toBe(0);
  });

  test("continues scoring other segments when HF API fails for one", async () => {
    mockHfError(503, "Service Unavailable");
    mockHfResponse(JOY_EMOTIONS);

    const res = await handler({
      httpMethod: "POST",
      body: JSON.stringify({ segments: [SEG(0, "Fail me"), SEG(1, "Joy!")] }),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    // Segment 0 failed → score 0; segment 1 succeeded → score > 0
    expect(body.segments[0].viralityScore).toBe(0);
    expect(body.segments[1].viralityScore).toBeGreaterThan(0);
  });
});
