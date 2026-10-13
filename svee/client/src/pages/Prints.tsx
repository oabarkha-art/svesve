import { useCatalog } from "@/contexts/CatalogContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Layout from "@/components/Layout";
import {
  formats,
  formatDimensions,
  money,
  type Artwork,
  type PrintFormat,
} from "@/data/artworks";
import { useCart } from "@/contexts/CartContext";
function PrintCard({ artwork }: { artwork: Artwork }) {
  const { t } = useLanguage();
  const { artworks, printPrices, ready, error: catalogError } = useCatalog();
  const [format, setFormat] = useState<PrintFormat>("A4");
  const cart = useCart();
  return (
    <article className="print-card" id={artwork.id}>
      <div className="print-image">
        <img
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">
          {artwork.category === "malerei" ? t("Malerei") : "Illustration"}
        </p>
        <h3 className="text-xl mb-2">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground mb-5">
          {" " + t("Handsignierter Kunstdruck \xB7 ohne Rahmen") + " "}
        </p>
        <label htmlFor={`format-${artwork.id}`} className="block text-sm mb-2">
          {" " + t("Format") + " "}
        </label>
        <select
          id={`format-${artwork.id}`}
          value={format}
          onChange={(e) => setFormat(e.target.value as PrintFormat)}
          className="shop-input mb-4"
        >
          {formats.map((size) => (
            <option key={size} value={size}>
              {size} · {formatDimensions[size]} · {money(printPrices[size])}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!ready}
          onClick={() => cart.add(artwork.id, format)}
          className="shop-button w-full"
        >
          {" " + t("In den Warenkorb \xB7") + " "}
          {money(printPrices[format])}
        </button>
      </div>
    </article>
  );
}
export default function Prints() {
  const { t } = useLanguage();
  const { artworks, printPrices, ready, error: catalogError } = useCatalog();
  const selected = new URLSearchParams(window.location.search).get("werk");
  const [filter, setFilter] = useState("alle");
  const visible = artworks.filter(
    (a) => filter === "alle" || a.category === filter,
  );
  const sorted = [...visible].sort(
    (a, b) => Number(b.id === selected) - Number(a.id === selected),
  );
  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <p className="eyebrow">{t("Kunst f\xFCr dein Zuhause")}</p>
        <h2 className="text-4xl md:text-5xl mb-5">{t("Prints")}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {" " +
            t(
              "Alle Prints werden auf hochwertigem Papier gedruckt. W\xE4hl ein Format, leg den Print in den Warenkorb und sende mir eine unverbindliche Bestellanfrage.",
            ) +
            " "}
        </p>
        <p className="text-muted-foreground max-w-2xl mt-4">
          {" " +
            t(
              "Alle Prints werden von mir handsigniert und mit einer kleinen Gru\xDFkarte verschickt.",
            ) +
            " "}
        </p>
      </section>
      <section className="container">
        <div className="flex flex-wrap gap-3" aria-label={t("Prints filtern")}>
          {[
            ["alle", t("Alle Motive")],
            ["malerei", t("Malerei")],
            ["illustration", "Illustration"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`filter-button ${filter === value ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4" aria-live="polite">
          {visible.length}
          {" · " +
            formats
              .map((size) => `${size} ${money(printPrices[size])}`)
              .join(" · ")}
        </p>
        {catalogError && <p role="alert">{catalogError}</p>}
        <div className="gallery-grid">
          {sorted.map((artwork) => (
            <PrintCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
      <section className="container py-12">
        <h3 className="text-2xl mb-8">{t("So kommt dein Print zu dir")}</h3>
        <ol className="grid md:grid-cols-3 gap-8">
          {[
            [
              "01",
              t("Dein Lieblingsmotiv"),
              t(
                "W\xE4hle Motiv und Format und lege deine Prints in den Warenkorb.",
              ),
            ],
            [
              "02",
              t("Deine Anfrage"),
              t(
                "Schicke mir deine Auswahl und deine Lieferadresse. Du bezahlst noch nichts.",
              ),
            ],
            [
              "03",
              t("Post von mir"),
              t(
                "Ich melde mich per E-Mail mit Verf\xFCgbarkeit, Versandkosten und Zahlungsdetails. Erst wenn du mein Angebot annimmst, wird daraus eine Bestellung.",
              ),
            ],
          ].map(([number, title, text]) => (
            <li key={number}>
              <span className="text-primary text-sm">{number}</span>
              <h4 className="text-xl my-3">{title}</h4>
              <p className="text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </Layout>
  );
}
