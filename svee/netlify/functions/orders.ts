import { createHash } from "node:crypto";
import { getDatabase } from "@netlify/database";
import type { Config } from "@netlify/functions";
import { prepareOrder, type PreparedOrder } from "../../shared/orders";
import { money } from "../../client/src/data/artworks";

const reply = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function notify(
  order: PreparedOrder,
): Promise<"sent" | "pending" | "failed"> {
  const token = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const to = process.env.ORDER_EMAIL_TO;
  if (!token || !from || !to) return "pending";
  try {
    const customer = order.customer;
    const text = [
      `Neue unverbindliche Print-Anfrage: ${order.requestId}`,
      ...order.items.map(
        (item) =>
          `${item.quantity} × ${item.title} · ${item.format} · ${money(item.unitPrice * item.quantity)}`,
      ),
      `Prints gesamt: ${money(order.total)} (Versand noch offen)`,
      "",
      customer.name,
      customer.email,
      customer.street,
      `${customer.postalCode} ${customer.city}`,
      customer.country,
      "",
      customer.message,
    ].join("\n");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `print-order-${order.requestId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: customer.email,
        subject: `Neue Print-Anfrage ${order.requestId}`,
        text,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error("Order notification failed", response.status);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("Order notification unavailable");
    return "failed";
  }
}

export default async function handler(request: Request) {
  if (request.method !== "POST")
    return reply(
      { error: "Diese Adresse akzeptiert nur Bestellanfragen." },
      405,
    );
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply({ error: "Anfrage nicht erlaubt." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Bitte sende die Anfrage als JSON." }, 415);
  let order: PreparedOrder;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 32_000)
      return reply({ error: "Die Anfrage ist zu groß." }, 413);
    order = prepareOrder(JSON.parse(body));
  } catch {
    return reply(
      { error: "Bitte prüfe deine Angaben, Motive, Formate und Mengen." },
      400,
    );
  }
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(order))
    .digest("hex");
  try {
    const db = getDatabase();
    const inserted = await db.sql<{ id: string }>`
      INSERT INTO orders (id, fingerprint, customer, items, total_cents)
      VALUES (${order.requestId}, ${fingerprint}, ${JSON.stringify(order.customer)}::jsonb,
        ${JSON.stringify(order.items)}::jsonb, ${order.total})
      ON CONFLICT (id) DO NOTHING RETURNING id`;
    if (inserted.length === 0) {
      const existing = await db.sql<{
        fingerprint: string;
        total_cents: number;
      }>`
        SELECT fingerprint, total_cents FROM orders WHERE id = ${order.requestId}`;
      if (existing[0]?.fingerprint !== fingerprint)
        return reply(
          {
            error:
              "Diese Anfragenummer wurde bereits verwendet. Bitte lade die Seite neu.",
          },
          409,
        );
      return reply({
        orderId: order.requestId,
        total: existing[0].total_cents,
      });
    }
    // The saved request remains successful even if notification delivery fails.
    const status = await notify(order);
    try {
      await db.sql`UPDATE orders SET notification_status = ${status} WHERE id = ${order.requestId}`;
    } catch {
      console.error(
        "Could not update order notification status",
        order.requestId,
      );
    }
    return reply({ orderId: order.requestId, total: order.total }, 201);
  } catch {
    console.error("Could not persist print order", order.requestId);
    return reply(
      {
        error:
          "Deine Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut oder schreib mir per E-Mail.",
      },
      503,
    );
  }
}
export const config: Config = {
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip", "domain"],
    windowSize: 60,
    windowLimit: 5,
  },
};
