import { beforeEach, describe, expect, it, vi } from "vitest";
const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));
vi.mock("@netlify/database", () => ({ getDatabase: () => ({ sql }) }));
import handler from "./orders";
const sample = {
  requestId: "5fdf3cb4-73fd-4077-91ac-d1542bc858ee",
  customer: {
    name: "Test Person",
    email: "test@example.com",
    street: "Teststraße 1",
    postalCode: "12345",
    city: "Teststadt",
    country: "Deutschland",
    message: "",
  },
  items: [{ artworkId: "painting-seerose", format: "A4", quantity: 2 }],
  acknowledged: true,
};
const request = (body: unknown = sample) =>
  new Request("https://example.com/.netlify/functions/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
    },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  sql.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.stubEnv("RESEND_API_KEY", "");
});
describe("order endpoint", () => {
  it("returns a receipt only after saving", async () => {
    sql
      .mockResolvedValueOnce([{ id: sample.requestId }])
      .mockResolvedValueOnce([]);
    const response = await handler(request());
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      orderId: sample.requestId,
      total: 4800,
    });
    expect(sql.mock.calls[0].slice(1)).toContain(4800);
  });
  it("does not claim success when persistence fails", async () => {
    sql.mockRejectedValueOnce(new Error("database down"));
    const response = await handler(request());
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("orderId");
  });
  it("handles retries without inserting or notifying twice", async () => {
    // Capture a fingerprint from a successful first submission.
    sql
      .mockResolvedValueOnce([{ id: sample.requestId }])
      .mockResolvedValueOnce([]);
    await handler(request());
    const fingerprint = sql.mock.calls[0][2];
    sql.mockReset();
    sql
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ fingerprint, total_cents: 4800 }]);
    const response = await handler(request());
    expect(response.status).toBe(200);
    expect(sql).toHaveBeenCalledTimes(2);
  });
  it("rejects reuse of a request ID for different data", async () => {
    sql
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ fingerprint: "different", total_cents: 4800 }]);
    expect((await handler(request())).status).toBe(409);
  });
  it("validates requests before touching the database", async () => {
    expect((await handler(request({ ...sample, items: [] }))).status).toBe(400);
    expect(
      (
        await handler(
          new Request("https://example.com/.netlify/functions/orders"),
        )
      ).status,
    ).toBe(405);
    expect(
      (
        await handler(
          new Request("https://example.com/.netlify/functions/orders", {
            method: "POST",
            headers: { origin: "https://other.com" },
          }),
        )
      ).status,
    ).toBe(403);
    expect(sql).not.toHaveBeenCalled();
  });
  it("keeps saved order when email fails and records failure", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("ORDER_EMAIL_FROM", "sender@example.com");
    vi.stubEnv("ORDER_EMAIL_TO", "artist@example.com");
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response("unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetch);
    sql
      .mockResolvedValueOnce([{ id: sample.requestId }])
      .mockResolvedValueOnce([]);
    expect((await handler(request())).status).toBe(201);
    expect(sql.mock.calls[1].slice(1)).toContain("failed");
    expect(JSON.parse(fetch.mock.calls[0][1].body).reply_to).toBe(
      "test@example.com",
    );
  });
});
