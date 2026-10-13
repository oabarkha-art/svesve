import { describe, it, expect } from "vitest";
import {
  readLimitedBody,
  BodyTooLarge,
} from "../../supabase/functions/orders/limits";
import fs from "node:fs";
describe("request size enforcement", () => {
  it("accepts valid UTF-8 split across chunks", async () => {
    const bytes = new TextEncoder().encode("Grüße");
    const body = new ReadableStream({
      start(c) {
        c.enqueue(bytes.slice(0, 3));
        c.enqueue(bytes.slice(3));
        c.close();
      },
    });
    expect(
      await readLimitedBody(
        new Request("https://example.com", {
          method: "POST",
          body,
          duplex: "half",
        } as RequestInit),
        30,
      ),
    ).toBe("Grüße");
  });
  it("rejects oversized streams without Content-Length and cancels early", async () => {
    let cancelled = false;
    const body = new ReadableStream({
      pull(c) {
        c.enqueue(new Uint8Array(1000));
      },
      cancel() {
        cancelled = true;
      },
    });
    await expect(
      readLimitedBody(
        new Request("https://example.com", {
          method: "POST",
          body,
          duplex: "half",
        } as RequestInit),
        2000,
      ),
    ).rejects.toBeInstanceOf(BodyTooLarge);
    expect(cancelled).toBe(true);
  });
  it("rejects a declared oversized body", async () => {
    await expect(
      readLimitedBody(
        new Request("https://example.com", {
          method: "POST",
          headers: { "Content-Length": "50000" },
          body: "x",
        }),
      ),
    ).rejects.toBeInstanceOf(BodyTooLarge);
  });
});
it("restricts scripts, frames and API connections while allowing the actual app resources", () => {
  const config = JSON.parse(
    fs.readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"),
  );
  const headers = config.headers[0].headers;
  const csp = headers.find(
    (h: { key: string }) => h.key === "Content-Security-Policy",
  ).value;
  expect(csp).toContain("script-src 'self';");
  expect(csp).not.toContain("unsafe-eval");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("https://fotvltwehrujlkfvoses.supabase.co");
  expect(csp).toContain("font-src 'self' data:");
});
