/**
 * Tests for netlify/functions/ideagen-generate.js
 *
 * The OpenAI client is mocked so no real API calls are made.
 */

"use strict";

// ── Mock the openai package ────────────────────────────────────────────────
const mockCreate = jest.fn();
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

const { handler } = require("../netlify/functions/ideagen-generate");

// ── Helpers ─────────────────────────────────────────────────────────────────
function makeEvent(body, method = "POST") {
  return { httpMethod: method, body: JSON.stringify(body) };
}

const SAMPLE_CONCEPTS = Array.from({ length: 10 }, (_, i) => ({
  hook: `Hook ${i}`,
  description: `Desc ${i}`,
  sounds: ["s1", "s2", "s3"],
  hashtags: ["#a", "#b", "#c", "#d", "#e"],
}));

// ── Tests ────────────────────────────────────────────────────────────────────
describe("ideagen-generate", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    mockCreate.mockReset();
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  test("returns 405 for non-POST requests", async () => {
    const res = await handler({ httpMethod: "GET" });
    expect(res.statusCode).toBe(405);
  });

  test("returns 400 when body is not valid JSON", async () => {
    const res = await handler({ httpMethod: "POST", body: "not-json" });
    expect(res.statusCode).toBe(400);
  });

  test("returns 400 when topic or niche is missing", async () => {
    const res = await handler(makeEvent({ topic: "Fitness" }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/niche/i);
  });

  test("returns 500 when OPENAI_API_KEY is not set", async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await handler(makeEvent({ topic: "Fitness", niche: "Home" }));
    expect(res.statusCode).toBe(500);
  });

  test("returns 200 with concepts array on success (bare array response)", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(SAMPLE_CONCEPTS) } }],
    });

    const res = await handler(makeEvent({ topic: "Fitness", niche: "Home-Workouts" }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.concepts)).toBe(true);
    expect(body.concepts).toHaveLength(10);
  });

  test("returns 200 with concepts array on success (wrapped object response)", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ concepts: SAMPLE_CONCEPTS }) } }],
    });

    const res = await handler(makeEvent({ topic: "Kochen", niche: "Vegan" }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.concepts).toHaveLength(10);
  });

  test("returns 502 when OpenAI throws", async () => {
    mockCreate.mockRejectedValue(new Error("rate limit"));

    const res = await handler(makeEvent({ topic: "Travel", niche: "Budget" }));
    expect(res.statusCode).toBe(502);
    expect(JSON.parse(res.body).detail).toBe("rate limit");
  });
});
