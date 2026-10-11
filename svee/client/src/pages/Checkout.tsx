import { inquiryLink } from "@/lib/contact";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useCart, itemKey } from "@/contexts/CartContext";
import { artworks, printPrices, money } from "@/data/artworks";
import { orderSchema } from "../../../shared/orders";

export default function Checkout() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; total: number } | null>(
    null,
  );
  // Reuse only for an identical payload after a network failure.
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const customer = Object.fromEntries(
      [
        "name",
        "email",
        "street",
        "postalCode",
        "city",
        "country",
        "message",
      ].map((key) => [key, String(data.get(key) || "").trim()]),
    );
    const payload = {
      customer,
      items: cart.items,
      acknowledged: data.get("acknowledged") === "on",
      website: String(data.get("website") || ""),
    };
    const signature = JSON.stringify(payload);
    if (attempt.current?.signature !== signature)
      attempt.current = { signature, id: crypto.randomUUID() };
    const parsed = orderSchema.safeParse({
      ...payload,
      requestId: attempt.current!.id,
    });
    if (!parsed.success) {
      setError(
        "Bitte prüfe deine Kontaktdaten, Lieferadresse und die Bestätigung zur unverbindlichen Anfrage.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/.netlify/functions/orders", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.orderId || !Number.isInteger(result.total))
        throw new Error(
          result?.error ||
            "Deine Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut oder schreib mir per E-Mail.",
        );
      setReceipt({ id: result.orderId, total: result.total });
      cart.clear();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bitte versuche es erneut.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <p className="eyebrow">Deine Auswahl</p>
        <h2 className="text-4xl md:text-5xl mb-5">Bestellanfrage</h2>
        {receipt ? (
          <div role="status" className="max-w-xl py-8">
            <h3 className="text-2xl mb-5">Danke für deine Anfrage!</h3>
            <p className="mb-4">
              Deine Anfrage wurde gespeichert. Ich melde mich per E-Mail mit
              Verfügbarkeit, Versandkosten und Zahlungsdetails.
            </p>
            <p className="text-sm break-all mb-4">
              Anfragenummer: <strong>{receipt.id}</strong>
            </p>
            <p className="mb-6">
              Prints gesamt: {money(receipt.total)} · zzgl. Versand nach
              Angebot. Es wurde keine Zahlung ausgelöst.
            </p>
            <Link href="/prints" className="shop-button">
              Weitere Prints entdecken
            </Link>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="py-8">
            <p className="mb-6">Dein Warenkorb ist noch leer.</p>
            <Link href="/prints" className="shop-button">
              Prints entdecken
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground max-w-xl mb-10">
              Du sendest eine unverbindliche Anfrage. Du bezahlst jetzt nichts.
              Verfügbarkeit, Versandkosten und Zahlungsdetails erhältst du mit
              meinem Angebot per E-Mail.
            </p>
            <div className="grid lg:grid-cols-2 gap-12">
              <form onSubmit={submit} className="space-y-5">
                <fieldset disabled={busy} className="space-y-5">
                  <legend className="text-xl font-semibold mb-5">
                    Kontakt & Lieferadresse
                  </legend>
                  <label className="hidden" aria-hidden="true">
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                  {[
                    ["name", "Name", "text", "name", 120],
                    ["email", "E-Mail", "email", "email", 254],
                    [
                      "street",
                      "Straße und Hausnummer",
                      "text",
                      "address-line1",
                      200,
                    ],
                    ["postalCode", "Postleitzahl", "text", "postal-code", 20],
                    ["city", "Ort", "text", "address-level2", 120],
                    ["country", "Land", "text", "country-name", 80],
                  ].map(([name, label, type, autoComplete, max]) => (
                    <div key={String(name)}>
                      <label
                        htmlFor={String(name)}
                        className="block text-sm mb-2"
                      >
                        {label}
                      </label>
                      <input
                        id={String(name)}
                        name={String(name)}
                        type={String(type)}
                        autoComplete={String(autoComplete)}
                        required
                        maxLength={Number(max)}
                        defaultValue={
                          name === "country" ? "Deutschland" : undefined
                        }
                        className="shop-input"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">
                      Nachricht (optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      maxLength={2000}
                      className="shop-input"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Deine Angaben verwende ich zur Bearbeitung deiner Anfrage
                    und zur Klärung des Versands.
                  </p>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      name="acknowledged"
                      type="checkbox"
                      required
                      className="mt-1"
                    />
                    <span>
                      Ich möchte eine unverbindliche Bestellanfrage senden. Ein
                      Kauf kommt erst zustande, wenn ich das spätere Angebot
                      annehme.
                    </span>
                  </label>
                  {error && (
                    <p role="alert" className="text-primary">
                      {error}{" "}
                      <a
                        href={inquiryLink("Print-Bestellanfrage")}
                        className="underline"
                      >
                        E-Mail schreiben
                      </a>
                    </p>
                  )}
                  <button
                    type="submit"
                    className="shop-button w-full"
                    disabled={busy}
                  >
                    {busy
                      ? "Anfrage wird gespeichert …"
                      : "Unverbindliche Anfrage senden"}
                  </button>
                </fieldset>
              </form>
              <aside className="bg-muted/40 p-6 h-fit rounded-sm">
                <h3 className="text-2xl mb-5">Deine Prints</h3>
                <ul className="divide-y divide-border">
                  {cart.items.map((item) => {
                    const artwork = artworks.find(
                      (a) => a.id === item.artworkId,
                    )!;
                    return (
                      <li key={itemKey(item)} className="flex gap-4 py-4">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-16 h-20 object-contain"
                        />
                        <div className="flex-1">
                          <p>{artwork.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.format}
                          </p>
                        </div>
                        <span>
                          {money(item.quantity * printPrices[item.format])}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="flex justify-between border-t border-border pt-5 mt-3">
                  <strong>Prints gesamt</strong>
                  <strong>{money(cart.total)}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  Zuzüglich Versandkosten nach Angebot.
                </p>
                <button
                  type="button"
                  className="text-primary underline mt-5"
                  disabled={busy}
                  onClick={() => cart.setOpen(true)}
                >
                  Warenkorb bearbeiten
                </button>
              </aside>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
