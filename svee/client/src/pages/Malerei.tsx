import { useState } from "react";
import Layout from "@/components/Layout";

import { paintings } from "@/data/artworks";
import { Link } from "wouter";

export default function Malerei() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <p className="text-sm tracking-widest uppercase text-primary mb-3 font-medium">
          Kategorie
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Malerei
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Abends sitze ich meistens in meinem kleinen Atelier und male. Ich
          benutze dafür Ölfarben, ein Material, das eine lange Geschichte hat.
          Es ist warm und weich, fügt sich ineinander und gibt den Bildern
          vertraute Tiefe. Meine Motive erzählen von Menschen und ihren
          Beziehungen zueinander und zu der fantastischen Welt, in der wir
          leben.
        </p>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-line" />
      </div>

      {/* Gallery Grid */}
      <section className="container">
        {paintings.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <p className="text-lg">Werke werden demnächst hinzugefügt.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {paintings.map((artwork) => (
              <div
                key={artwork.id}
                className="artwork-card"
                onMouseEnter={() => setHoveredId(artwork.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Artwork Image */}
                <div className="overflow-hidden rounded-sm bg-muted">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    loading="lazy"
                    decoding="async"
                    className={`artwork-image artwork-hover ${
                      hoveredId === artwork.id ? "scale-105" : ""
                    }`}
                  />
                </div>

                {/* Artwork Info */}
                <div className="artwork-info">
                  <div>
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {artwork.year ? `${artwork.year} — ` : ""}
                      {artwork.technique}
                    </p>
                  </div>
                  <p className="artwork-description">{artwork.description}</p>
                  <Link
                    href={`/prints?werk=${artwork.id}`}
                    className="text-primary underline underline-offset-4 text-sm"
                  >
                    Als Print entdecken →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-10 max-w-3xl">
        <h3 className="text-2xl mb-4">Ein Porträt für dich</h3>
        <p className="text-muted-foreground mb-6">
          Du wünschst dir ein individuell handgemaltes Porträt als Geschenk für
          eine Hochzeit oder zu Weihnachten? Schreib mir von deiner Vision! Ich
          male mit Ölfarben auf Leinwand.
        </p>
        <a
          className="shop-button"
          href="mailto:abarkha@outlook.com?subject=Anfrage%20Portr%C3%A4t"
        >
          Gemälde anfragen
        </a>
      </section>
      {/* Bottom spacing */}
      <div className="py-16" />
    </Layout>
  );
}
