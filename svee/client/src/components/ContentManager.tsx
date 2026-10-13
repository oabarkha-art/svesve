import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import {
  useSiteContent,
  safeImage,
  type ContentField,
  type Book,
} from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
const sectionNames: Record<string, string> = {
  Home: "Startseite",
  Layout: "Navigation & Fußzeile",
  Malerei: "Malerei",
  Illustration: "Illustration",
  Prints: "Prints",
  Checkout: "Bestellanfrage",
  Cart: "Warenkorb",
  NotFound: "Fehlerseite",
  Contact: "Kontakt",
  BookPreview: "Bücher – Bildbeschriftungen",
};
const blankBook = (): Book => ({
  id: crypto.randomUUID(),
  title_de: "",
  title_en: "",
  meta_de: "",
  meta_en: "",
  description_de: "",
  description_en: "",
  cover: "",
  teasers: [],
  published: true,
  sort_order: 100,
});
async function uploadImage(file: File) {
  if (!supabase) throw new Error("Not configured");
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10485760
  )
    throw new Error("JPG, PNG oder WebP / up to 10 MB");
  const name = `site/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
  const { error } = await supabase.storage
    .from("artwork-images")
    .upload(name, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("artwork-images").getPublicUrl(name).data
    .publicUrl;
}
function ImageUpload({
  src,
  label,
  disabled,
  onChange,
  onUpload,
  required = false,
}: {
  required?: boolean;
  src: string;
  label: string;
  disabled: boolean;
  onChange: (src: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="space-y-2">
      {src && safeImage(src) && (
        <img
          src={safeImage(src)}
          alt={label}
          className="h-32 max-w-full object-contain"
        />
      )}
      <label className="block">
        {label}
        <input
          className="shop-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
      {src && !required && (
        <button
          className="filter-button"
          type="button"
          disabled={disabled}
          onClick={() => onChange("")}
        >
          Entfernen / Remove
        </button>
      )}
    </div>
  );
}
export default function ContentManager() {
  const { reload } = useSiteContent();
  const { language } = useLanguage();
  const l = (de: string, en: string) => (language === "en" ? en : de);
  const [fields, setFields] = useState<ContentField[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [section, setSection] = useState("");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("text");
  const [field, setField] = useState<ContentField | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  async function load() {
    if (!supabase) return;
    const [c, b] = await Promise.all([
      supabase.from("site_content").select("*").order("section"),
      supabase.from("books").select("*").order("sort_order"),
    ]);
    if (c.error || b.error)
      throw new Error(
        l("Inhalte konnten nicht geladen werden.", "Could not load content."),
      );
    setFields(c.data);
    setBooks(b.data as Book[]);
    setLoaded(true);
  }
  useEffect(() => {
    void load().catch((e) => setMessage(e.message));
  }, []);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  async function saveField(e: FormEvent) {
    e.preventDefault();
    if (!field) return;
    await run(async () => {
      const placeholders = (s: string) =>
        Array.from(s.matchAll(/\{\w+\}/g))
          .map((m) => m[0])
          .sort()
          .join(",");
      if (
        field.kind === "text" &&
        [field.de, field.en].some(
          (s) => placeholders(s) !== placeholders(field.key),
        )
      )
        throw new Error(
          l(
            "Bitte Platzhalter wie {title} und {count} in beiden Sprachen beibehalten.",
            "Keep placeholders such as {title} and {count} in both languages.",
          ),
        );
      const { error } = await supabase!
        .from("site_content")
        .update({ de: field.de, en: field.en })
        .eq("key", field.key)
        .select("key")
        .single();
      if (error) throw error;
      await load();
      await reload();
      setField(null);
      setMessage(
        l(
          "Inhalt gespeichert und veröffentlicht.",
          "Content saved and published.",
        ),
      );
    });
  }
  async function saveBook(e: FormEvent) {
    e.preventDefault();
    if (!book) return;
    await run(async () => {
      const { error } = await supabase!
        .from("books")
        .upsert({ ...book, teasers: book.teasers.filter(Boolean) });
      if (error) throw error;
      await load();
      await reload();
      setBook(null);
      setMessage(l("Buch gespeichert.", "Book saved."));
    });
  }
  const visible = fields.filter(
    (f) =>
      (mode === "text"
        ? f.kind === "text"
        : mode === "image"
          ? f.kind === "image"
          : ["email", "link"].includes(f.kind)) &&
      (!section || f.section === section) &&
      (!search ||
        `${f.key} ${f.de} ${f.en}`
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <section className="mb-14 border-b pb-10">
      <h2 className="text-3xl mb-4">
        {l("Website-Inhalte", "Website content")}
      </h2>
      <p className="mb-5">
        {l(
          "Änderungen werden nach dem Speichern direkt veröffentlicht. Texte als normalen Text eingeben; Platzhalter in geschweiften Klammern beibehalten.",
          "Changes publish when saved. Enter plain text and keep placeholders in curly brackets.",
        )}
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          ["text", l("Texte DE / EN", "Texts DE / EN")],
          ["image", l("Startseiten-Bilder", "Home images")],
          ["links", l("Kontakt & Links", "Contact & links")],
          ["books", l("Bücher", "Books")],
        ].map(([v, t]) => (
          <button
            className={`filter-button ${mode === v ? "active" : ""}`}
            key={v}
            type="button"
            disabled={busy}
            aria-pressed={mode === v}
            onClick={() => {
              setMode(v);
              setSection("");
              setSearch("");
              setField(null);
              setBook(null);
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {message && (
        <p role="status" className="p-4 bg-muted mb-4">
          {message}
        </p>
      )}
      {!loaded && (
        <button className="filter-button" onClick={() => void run(load)}>
          {l("Inhalte laden", "Load content")}
        </button>
      )}
      {mode !== "books" ? (
        <>
          <div className="flex flex-wrap gap-4 mb-5">
            <label>
              {l("Bereich", "Section")}
              <select
                className="shop-input"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="">{l("Alle Bereiche", "All sections")}</option>
                {Array.from(new Set(fields.map((f) => f.section)))
                  .sort()
                  .map((s) => (
                    <option key={s} value={s}>
                      {sectionNames[s] || s}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {l("Suchen", "Search")}
              <input
                className="shop-input"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          {field && (
            <form className="bg-muted p-5 mb-6 space-y-4" onSubmit={saveField}>
              <h3 className="text-xl">
                {sectionNames[field.section] || field.section}
              </h3>
              <p className="text-sm break-words">{field.key}</p>
              {field.kind === "image" ? (
                <ImageUpload
                  required
                  src={field.de}
                  label={l("Bild ersetzen", "Replace image")}
                  disabled={busy}
                  onChange={(de) => setField({ ...field, de })}
                  onUpload={(file) =>
                    void run(async () => {
                      const de = await uploadImage(file);
                      setField((f) => (f ? { ...f, de } : f));
                    })
                  }
                />
              ) : field.kind === "text" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {(["de", "en"] as const).map((lang) => (
                    <label key={lang}>
                      {lang === "de" ? "Deutsch" : "English"}
                      <textarea
                        className="shop-input min-h-36"
                        maxLength={12000}
                        value={field[lang]}
                        onChange={(e) =>
                          setField({ ...field, [lang]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <label>
                  {field.kind === "email" ? "E-Mail" : "URL (https://)"}
                  <input
                    className="shop-input"
                    type={field.kind === "email" ? "email" : "url"}
                    required
                    value={field.de}
                    onChange={(e) => setField({ ...field, de: e.target.value })}
                  />
                </label>
              )}
              {field.key === "contact.cc" && (
                <p>
                  {l(
                    "Die CC-Adresse ist im E-Mail-Entwurf sichtbar, aber nicht als Kontakt auf der Website.",
                    "The CC address is visible in the email draft, but not displayed as a contact on the website.",
                  )}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  className="shop-button"
                  disabled={busy || (field.kind === "image" && !field.de)}
                >
                  {l("Speichern", "Save")}
                </button>
                <button
                  type="button"
                  className="filter-button"
                  disabled={busy}
                  onClick={() => setField(null)}
                >
                  {l("Abbrechen", "Cancel")}
                </button>
              </div>
            </form>
          )}
          <div className="max-h-[32rem] overflow-y-auto border divide-y">
            {visible.map((f) => (
              <div className="p-4 flex gap-4 items-center" key={f.key}>
                {f.kind === "image" && (
                  <img
                    src={safeImage(f.de)}
                    alt=""
                    className="w-24 h-20 object-contain"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {sectionNames[f.section] || f.section}
                  </p>
                  <p className="line-clamp-2 break-words">
                    {f.kind === "image" ? f.key : f.de || f.key}
                  </p>
                  {f.kind === "text" && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      EN: {f.en}
                    </p>
                  )}
                </div>
                <button
                  className="filter-button"
                  disabled={busy}
                  onClick={() => setField({ ...f })}
                >
                  {l("Bearbeiten", "Edit")}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="shop-button mb-6"
            disabled={busy || !loaded}
            onClick={() => setBook(blankBook())}
          >
            {l("Buch hinzufügen", "Add book")}
          </button>
          {book && (
            <form
              className="bg-muted p-5 grid md:grid-cols-2 gap-4 mb-6"
              onSubmit={saveBook}
            >
              {(
                [
                  "title_de",
                  "title_en",
                  "meta_de",
                  "meta_en",
                  "description_de",
                  "description_en",
                ] as const
              ).map((k, i) => (
                <label key={k}>
                  {
                    [
                      "Titel (DE)",
                      "Title (EN)",
                      "Jahr · Technik · Seiten (DE)",
                      "Year · medium · pages (EN)",
                      "Beschreibung (DE)",
                      "Description (EN)",
                    ][i]
                  }
                  <textarea
                    className="shop-input"
                    rows={k.startsWith("description") ? 5 : 2}
                    required={k.startsWith("title")}
                    value={book[k]}
                    onChange={(e) => setBook({ ...book, [k]: e.target.value })}
                  />
                </label>
              ))}
              <label>
                {l("Reihenfolge", "Sort order")}
                <input
                  type="number"
                  className="shop-input"
                  required
                  value={book.sort_order}
                  onChange={(e) =>
                    setBook({ ...book, sort_order: Number(e.target.value) })
                  }
                />
              </label>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={book.published}
                  onChange={(e) =>
                    setBook({ ...book, published: e.target.checked })
                  }
                />
                {l("Veröffentlicht", "Published")}
              </label>
              <ImageUpload
                src={book.cover}
                label={l("Buch-Cover / Mockup", "Book cover / mockup")}
                disabled={busy}
                onChange={(cover) => setBook({ ...book, cover })}
                onUpload={(file) =>
                  void run(async () => {
                    const cover = await uploadImage(file);
                    setBook((b) => (b ? { ...b, cover } : b));
                  })
                }
              />
              {[0, 1, 2, 3].map((i) => (
                <ImageUpload
                  key={i}
                  src={book.teasers[i] || ""}
                  label={`${l("Einblick", "Preview")} ${i + 1}`}
                  disabled={busy}
                  onChange={(src) => {
                    const teasers = Array.from({ length: 4 }, (_, n) =>
                      n === i ? src : book.teasers[n] || "",
                    );
                    setBook({ ...book, teasers });
                  }}
                  onUpload={(file) =>
                    void run(async () => {
                      const src = await uploadImage(file);
                      setBook((b) =>
                        b
                          ? {
                              ...b,
                              teasers: Array.from({ length: 4 }, (_, n) =>
                                n === i ? src : b.teasers[n] || "",
                              ),
                            }
                          : b,
                      );
                    })
                  }
                />
              ))}
              <div className="md:col-span-2 flex gap-3">
                <button className="shop-button" disabled={busy}>
                  {l("Buch speichern", "Save book")}
                </button>
                <button
                  type="button"
                  className="filter-button"
                  disabled={busy}
                  onClick={() => setBook(null)}
                >
                  {l("Abbrechen", "Cancel")}
                </button>
              </div>
            </form>
          )}
          <div className="grid md:grid-cols-3 gap-5">
            {books.map((b) => (
              <article className="border p-4" key={b.id}>
                {b.cover && (
                  <img
                    src={safeImage(b.cover)}
                    alt={b.title_de}
                    className="h-40 w-full object-contain mb-3"
                  />
                )}
                <h3 className="text-xl mb-2">{b.title_de}</h3>
                <p className="mb-3">
                  {b.published
                    ? l("Veröffentlicht", "Published")
                    : l("Ausgeblendet", "Hidden")}
                </p>
                <button
                  className="filter-button"
                  disabled={busy}
                  onClick={() => setBook({ ...b, teasers: [...b.teasers] })}
                >
                  {l("Bearbeiten", "Edit")}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
