import { readLimitedBody, BodyTooLarge } from "./limits.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { z } from "npm:zod@4.1.12";
const text = (max: number) => z.string().trim().min(1).max(max);
const schema = z.object({
  requestId: z.string().uuid(),
  acknowledged: z.literal(true),
  website: z.string().max(0).optional(),
  customer: z.object({
    name: text(120),
    email: z.string().trim().email().max(254),
    street: text(200),
    postalCode: text(20),
    city: text(120),
    country: text(80),
    message: z.string().trim().max(2000).default(""),
  }),
  items: z
    .array(
      z.object({
        artworkId: text(100),
        format: z.enum(["A5", "A4", "A3"]),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(100),
});
const hash = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
  )
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowed = ["https://svesve-alpha.vercel.app"];
  const headers = {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
    Vary: "Origin",
    ...(allowed.includes(origin)
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Headers":
      "authorization,apikey,content-type,x-client-info",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };
  const reply = (status: number, data: unknown) =>
    new Response(JSON.stringify(data), { status, headers });
  if (origin && !allowed.includes(origin))
    return reply(403, { error: "Origin not allowed" });
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return reply(405, { error: "POST required" });
  // The gateway verifies JWTs; this endpoint intentionally accepts guest print requests.
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return reply(415, { error: "JSON required" });
  try {
    let raw: string;
    try {
      raw = await readLimitedBody(req);
    } catch (error) {
      if (error instanceof BodyTooLarge)
        return reply(413, { error: "Request too large" });
      throw error;
    }
    let input;
    try {
      input = schema.parse(JSON.parse(raw));
    } catch {
      return reply(400, {
        error: "Bitte prüfe die Angaben. / Please check your details.",
      });
    }
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const fingerprint = await hash(JSON.stringify(input));
    const existing = await db
      .from("orders")
      .select("id,fingerprint,total_cents")
      .eq("id", input.requestId)
      .maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data)
      return existing.data.fingerprint === fingerprint
        ? reply(200, {
            orderId: existing.data.id,
            total: existing.data.total_cents,
          })
        : reply(409, { error: "Request ID already used" });
    const emailKey = await hash("email:" + input.customer.email.toLowerCase());
    const ipKey = await hash(
      "ip:" +
        (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown"),
    );
    for (const key of [emailKey, ipKey]) {
      const r = await db.rpc("consume_order_limit", { rate_key: key });
      if (r.error) throw r.error;
      if (!r.data)
        return reply(429, {
          error: "Bitte später erneut versuchen. / Please try again later.",
        });
    }
    const [a, p] = await Promise.all([
      db
        .from("artworks")
        .select("id,title")
        .eq("published", true)
        .in(
          "id",
          input.items.map((i) => i.artworkId),
        ),
      db.from("print_prices").select("*"),
    ]);
    if (a.error || p.error) throw new Error("catalog");
    const seen = new Set<string>();
    const items = [];
    for (const item of input.items) {
      const art = a.data.find((a) => a.id === item.artworkId);
      const price = p.data.find((p) => p.format === item.format);
      const key = item.artworkId + ":" + item.format;
      if (!art || !price || seen.has(key))
        return reply(400, {
          error:
            "Bitte aktualisiere den Warenkorb. / Please refresh your cart.",
        });
      seen.add(key);
      items.push({ ...item, title: art.title, unitPrice: price.cents });
    }
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const insert = await db.from("orders").insert({
      id: input.requestId,
      fingerprint,
      customer: input.customer,
      items,
      total_cents: total,
    });
    if (insert.error) {
      if (insert.error.code === "23505") {
        const r = await db
          .from("orders")
          .select("fingerprint,total_cents")
          .eq("id", input.requestId)
          .single();
        if (r.data?.fingerprint === fingerprint)
          return reply(200, {
            orderId: input.requestId,
            total: r.data.total_cents,
          });
        return reply(409, { error: "Request ID already used" });
      }
      throw insert.error;
    }
    return reply(201, { orderId: input.requestId, total });
  } catch {
    return reply(503, {
      error:
        "Deine Anfrage konnte nicht gespeichert werden. / Could not save your request. Please try again.",
    });
  }
});
