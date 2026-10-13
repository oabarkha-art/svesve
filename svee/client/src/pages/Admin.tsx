import ContentManager from "@/components/ContentManager";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { useCatalog, type CatalogArtwork } from "@/contexts/CatalogContext";
import { formats, money, type PrintFormat } from "@/data/artworks";
import { useLanguage } from "@/contexts/LanguageContext";
type Order = {
  id: string;
  created_at: string;
  customer: {
    name: string;
    email: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    message: string;
  };
  items: {
    title: string;
    format: string;
    quantity: number;
    unitPrice: number;
  }[];
  total_cents: number;
  status: string;
  notification_status: string;
};
const blank = (): CatalogArtwork => ({
  id: crypto.randomUUID(),
  category: "malerei",
  title: "",
  description: "",
  image: "",
  technique: "",
  year: "",
  dimensions: "",
  sold: false,
  gallery: true,
  published: true,
  sort_order: 100,
});
export default function Admin() {
  const { language } = useLanguage();
  const en = language === "en";
  const label = (de: string, enText: string) => (en ? enText : de);
  const { reload } = useCatalog();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [works, setWorks] = useState<CatalogArtwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<PrintFormat, number>>({
    A5: 1200,
    A4: 2400,
    A3: 5200,
  });
  const [draft, setDraft] = useState<CatalogArtwork | null>(null);
  async function load() {
    if (!supabase) return;
    const [a, p, o] = await Promise.all([
      supabase.from("artworks").select("*").order("sort_order"),
      supabase.from("print_prices").select("*"),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (a.error || p.error || o.error)
      throw new Error(
        label("Daten konnten nicht geladen werden.", "Could not load data."),
      );
    setWorks(a.data as CatalogArtwork[]);
    setOrders(o.data as Order[]);
    setPrices(
      Object.fromEntries(p.data.map((p) => [p.format, p.cents])) as Record<
        PrintFormat,
        number
      >,
    );
  }
  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    let active = true;
    setAllowed(false);
    setChecking(true);
    if (!session || !supabase) {
      setChecking(false);
      return;
    }
    void supabase.rpc("is_admin").then(async ({ data, error }) => {
      if (!active) return;
      setAllowed(data === true && !error);
      setChecking(false);
      if (data === true && !error) {
        try {
          await load();
        } catch (e) {
          if (active) setMessage(String(e));
        }
      }
    });
    return () => {
      active = false;
    };
  }, [session?.user.id]);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  async function login(e: FormEvent) {
    e.preventDefault();
    await run(async () => {
      if (!supabase) throw new Error("Supabase is not configured");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setPassword("");
      if (error)
        throw new Error(
          label(
            "Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.",
            "Login failed. Please check your email and password.",
          ),
        );
    });
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft || !supabase) return;
    await run(async () => {
      const { error } = await supabase!.from("artworks").upsert(draft);
      if (error) throw error;
      setDraft(null);
      await load();
      await reload();
      setMessage(label("Werk gespeichert.", "Artwork saved."));
    });
  }
  async function upload(file: File) {
    if (!supabase || !draft) return;
    await run(async () => {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      )
        throw new Error(
          label(
            "Bitte JPG, PNG oder WebP bis 10 MB auswählen.",
            "Choose JPG, PNG or WebP up to 10 MB.",
          ),
        );
      const ext = file.type.split("/")[1];
      const path = crypto.randomUUID() + "." + ext;
      const { error } = await supabase!.storage
        .from("artwork-images")
        .upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase!.storage
        .from("artwork-images")
        .getPublicUrl(path);
      setDraft((d) => (d ? { ...d, image: data.publicUrl } : d));
    });
  }
  return (
    <Layout>
      <main className="container py-12">
        <h1 className="text-4xl mb-6">
          {label("Verwaltung", "Administration")}
        </h1>
        {message && (
          <p role="status" className="my-4 p-4 bg-muted">
            {message}
          </p>
        )}
        {checking ? (
          <p>{label("Zugang wird geprüft …", "Checking access …")}</p>
        ) : !session ? (
          <form className="max-w-md space-y-5" onSubmit={login}>
            <label className="block">
              E-Mail
              <input
                className="shop-input"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              {label("Passwort", "Password")}
              <input
                className="shop-input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="shop-button" disabled={busy || !supabase}>
              {label("Anmelden", "Sign in")}
            </button>
          </form>
        ) : (
          <>
            <button
              className="filter-button mb-8"
              onClick={() => void supabase!.auth.signOut()}
            >
              {label("Abmelden", "Sign out")}
            </button>
            {!allowed ? (
              <p role="alert">
                {label(
                  "Dieses Konto ist nicht für die Verwaltung freigeschaltet.",
                  "This account does not have administrator access.",
                )}
              </p>
            ) : (
              <>
                <ContentManager />
                <section className="mb-12">
                  <h2 className="text-2xl mb-4">
                    {label("Print-Preise", "Print prices")}
                  </h2>
                  <form
                    className="flex flex-wrap gap-4 items-end"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void run(async () => {
                        for (const format of formats) {
                          const { error } = await supabase!
                            .from("print_prices")
                            .update({ cents: prices[format] })
                            .eq("format", format);
                          if (error) throw error;
                        }
                        await reload();
                        setMessage(
                          label("Preise gespeichert.", "Prices saved."),
                        );
                      });
                    }}
                  >
                    {formats.map((f) => (
                      <label key={f}>
                        {f} (€)
                        <input
                          className="shop-input"
                          type="number"
                          min="1"
                          max="10000"
                          step="0.01"
                          required
                          value={prices[f] / 100}
                          onChange={(e) =>
                            setPrices((p) => ({
                              ...p,
                              [f]: Math.round(Number(e.target.value) * 100),
                            }))
                          }
                        />
                      </label>
                    ))}
                    <button className="shop-button" disabled={busy}>
                      {label("Preise speichern", "Save prices")}
                    </button>
                  </form>
                </section>
                <section className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl">
                      {label("Werke", "Artworks")} ({works.length})
                    </h2>
                    <button
                      className="shop-button"
                      onClick={() => setDraft(blank())}
                    >
                      {label("Neues Werk", "Add artwork")}
                    </button>
                  </div>
                  {draft && (
                    <form
                      onSubmit={save}
                      className="p-6 bg-muted grid md:grid-cols-2 gap-4 mb-8"
                    >
                      <h3 className="text-xl md:col-span-2">
                        {label("Werk bearbeiten", "Edit artwork")}
                      </h3>
                      {(
                        ["title", "technique", "year", "dimensions"] as const
                      ).map((k, i) => (
                        <label key={k}>
                          {
                            [
                              label("Titel", "Title"),
                              label("Technik", "Technique"),
                              label("Jahr", "Year"),
                              label("Maße", "Dimensions"),
                            ][i]
                          }
                          <input
                            className="shop-input"
                            required={k === "title"}
                            maxLength={200}
                            value={draft[k] || ""}
                            onChange={(e) =>
                              setDraft({ ...draft, [k]: e.target.value })
                            }
                          />
                        </label>
                      ))}
                      <label className="md:col-span-2">
                        {label("Beschreibung", "Description")}
                        <textarea
                          className="shop-input"
                          value={draft.description}
                          onChange={(e) =>
                            setDraft({ ...draft, description: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        {label("Kategorie", "Category")}
                        <select
                          className="shop-input"
                          value={draft.category}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              category: e.target.value as
                                "malerei" | "illustration",
                            })
                          }
                        >
                          <option value="malerei">
                            {label("Malerei", "Paintings")}
                          </option>
                          <option value="illustration">Illustration</option>
                        </select>
                      </label>
                      <label>
                        {label("Reihenfolge", "Sort order")}
                        <input
                          type="number"
                          className="shop-input"
                          value={draft.sort_order}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              sort_order: Number(e.target.value),
                            })
                          }
                        />
                      </label>
                      <label>
                        {label("Bild hochladen", "Upload image")}
                        <input
                          className="shop-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={busy}
                          onChange={(e) => {
                            if (e.target.files?.[0])
                              void upload(e.target.files[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {draft.image && (
                        <img
                          src={draft.image}
                          alt={draft.title}
                          className="h-32 object-contain"
                        />
                      )}
                      {(["sold", "gallery", "published"] as const).map(
                        (k, i) => (
                          <label key={k} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!draft[k]}
                              onChange={(e) =>
                                setDraft({ ...draft, [k]: e.target.checked })
                              }
                            />
                            {
                              [
                                label("Verkauft (Sold)", "Sold"),
                                label("In Galerie zeigen", "Show in gallery"),
                                label(
                                  "Veröffentlicht / als Print verfügbar",
                                  "Published / available as print",
                                ),
                              ][i]
                            }
                          </label>
                        ),
                      )}
                      <div className="md:col-span-2 flex gap-4">
                        <button
                          className="shop-button"
                          disabled={busy || !draft.image}
                        >
                          {label("Speichern", "Save")}
                        </button>
                        <button
                          type="button"
                          className="filter-button"
                          disabled={busy}
                          onClick={() => setDraft(null)}
                        >
                          {label("Abbrechen", "Cancel")}
                        </button>
                      </div>
                    </form>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {works.map((a) => (
                      <article key={a.id} className="border p-4">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="h-40 w-full object-contain mb-4"
                        />
                        <h3 className="text-lg">{a.title}</h3>
                        <p className="text-sm my-2">
                          {a.sold ? "Sold · " : ""}
                          {!a.published ? label("Ausgeblendet", "Hidden") : ""}
                        </p>
                        <button
                          className="filter-button"
                          disabled={busy}
                          onClick={() => setDraft({ ...a })}
                        >
                          {label("Bearbeiten", "Edit")}
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="text-2xl mb-3">
                    {label("Bestellanfragen", "Order requests")}
                  </h2>
                  <p className="mb-6">
                    {label(
                      "Die letzten 200 Anfragen. E-Mail-Benachrichtigungen sind noch nicht aktiviert.",
                      "The latest 200 requests. Email notifications are not enabled yet.",
                    )}
                  </p>
                  <button
                    className="filter-button mb-6"
                    disabled={busy}
                    onClick={() => void run(load)}
                  >
                    {label("Aktualisieren", "Refresh")}
                  </button>
                  {orders.length === 0 ? (
                    <p>{label("Noch keine Anfragen.", "No requests yet.")}</p>
                  ) : (
                    orders.map((o) => (
                      <article className="border p-6 mb-6" key={o.id}>
                        <h3 className="text-xl">
                          {o.customer.name} · {money(o.total_cents)}
                        </h3>
                        <p className="text-sm my-2">
                          {new Date(o.created_at).toLocaleString(
                            en ? "en-GB" : "de-DE",
                          )}{" "}
                          · {o.id}
                        </p>
                        <a
                          className="underline"
                          href={`mailto:${encodeURIComponent(o.customer.email)}?subject=${encodeURIComponent("Print-Anfrage " + o.id)}`}
                        >
                          {o.customer.email}
                        </a>
                        <p className="my-2">
                          {o.customer.street}, {o.customer.postalCode}{" "}
                          {o.customer.city}, {o.customer.country}
                        </p>
                        <ul>
                          {o.items.map((i, n) => (
                            <li key={n}>
                              {i.quantity} × {i.title} · {i.format} ·{" "}
                              {money(i.unitPrice)}
                            </li>
                          ))}
                        </ul>
                        {o.customer.message && (
                          <p className="my-3 whitespace-pre-wrap">
                            {o.customer.message}
                          </p>
                        )}
                        <label className="block mt-4">
                          Status
                          <select
                            className="shop-input max-w-xs"
                            disabled={busy}
                            value={o.status}
                            onChange={(e) => {
                              const status = e.target.value;
                              void run(async () => {
                                const { error } = await supabase!
                                  .from("orders")
                                  .update({ status })
                                  .eq("id", o.id);
                                if (error) throw error;
                                await load();
                              });
                            }}
                          >
                            {[
                              ["new", label("Neu", "New")],
                              ["contacted", label("Kontaktiert", "Contacted")],
                              [
                                "completed",
                                label("Abgeschlossen", "Completed"),
                              ],
                              ["cancelled", label("Storniert", "Cancelled")],
                            ].map(([v, l]) => (
                              <option key={v} value={v}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </label>
                      </article>
                    ))
                  )}
                </section>
              </>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}
