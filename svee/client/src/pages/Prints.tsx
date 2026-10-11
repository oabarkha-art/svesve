import { useState } from "react";
import Layout from "@/components/Layout";
import {
  artworks,
  formats,
  printPrices,
  formatDimensions,
  money,
  type Artwork,
  type PrintFormat,
} from "@/data/artworks";
import { useCart } from "@/contexts/CartContext";

function PrintCard({ artwork }: { artwork: Artwork }) {
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
          {artwork.category === "malerei" ? "Malerei" : "Illustration"}
        </p>
        <h3 className="text-xl mb-2">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Handsignierter Kunstdruck · ohne Rahmen
        </p>
        <label htmlFor={`format-${artwork.id}`} className="block text-sm mb-2">
          Format
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
          onClick={() => cart.add(artwork.id, format)}
          className="shop-button w-full"
        >
          In den Warenkorb · {money(printPrices[format])}
        </button>
      </div>
    </article>
  );
}
export default function Prints() {
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
        <p className="eyebrow">Kunst für dein Zuhause</p>
        <h2 className="text-4xl md:text-5xl mb-5">Prints</h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Alle Prints werden auf hochwertigem Papier gedruckt. Wähl ein Format,
          leg den Print in den Warenkorb und sende mir eine unverbindliche
          Bestellanfrage.
        </p>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Alle Prints werden von mir handsigniert und mit einer kleinen
          Grußkarte verschickt.
        </p>
      </section>
      <section className="container">
        <div className="flex flex-wrap gap-3" aria-label="Prints filtern">
          {[
            ["alle", "Alle Motive"],
            ["malerei", "Malerei"],
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
          {visible.length} Motive · A5 12 € · A4 24 € · A3 52 €
        </p>
        <div className="gallery-grid">
          {sorted.map((artwork) => (
            <PrintCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
      <section className="container py-12">
        <h3 className="text-2xl mb-8">So kommt dein Print zu dir</h3>
        <ol className="grid md:grid-cols-3 gap-8">
          {[
            [
              "01",
              "Dein Lieblingsmotiv",
              "Wähle Motiv und Format und lege deine Prints in den Warenkorb.",
            ],
            [
              "02",
              "Deine Anfrage",
              "Schicke mir deine Auswahl und deine Lieferadresse. Du bezahlst noch nichts.",
            ],
            [
              "03",
              "Post von mir",
              "Ich melde mich per E-Mail mit Verfügbarkeit, Versandkosten und Zahlungsdetails. Erst wenn du mein Angebot annimmst, wird daraus eine Bestellung.",
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
