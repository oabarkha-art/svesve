import { useState } from "react";
import Layout from "@/components/Layout";

import { illustrations } from "@/data/artworks";
import { Link } from "wouter";

export default function Illustration() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <p className="text-sm tracking-widest uppercase text-primary mb-3 font-medium">
          Kategorie
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Illustration
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Mir ist es wichtig, dass meine digitalen Illustrationen ein warmes,
          lebendiges Gefühl vermitteln.
        </p>
      </section>

      <section className="container pb-12 grid md:grid-cols-3 gap-8">
        <article>
          <h3 className="text-xl mb-3">
            Ich wünschte, ich hätte eine Schwester
          </h3>
          <p className="text-xs text-primary mb-3">
            2026 · Digitale Illustration · 22 Seiten
          </p>
          <p className="text-muted-foreground">
            Ein Mädchen hat Geburtstag. Sie wünscht sich eine kleine Schwester
            und stellt sich vor, in welch wunderbaren Abenteuern die beiden
            zusammen unterwegs wären. Sie spielen Verstecken, sind Piratinnen
            und Meerjungfrauen und trinken zusammen Tee im verwunschenen Garten.
          </p>
        </article>
        <article>
          <h3 className="text-xl mb-3">Secret little laws</h3>
          <p className="text-xs text-primary mb-3">
            2026 · Digitale Illustration
          </p>
          <p className="text-muted-foreground">
            Wusstest du, dass es kleine geheime Gesetze gibt, die nur Kinder
            verstehen können? In diesem Büchlein werden ein paar von ihnen
            verraten.
          </p>
        </article>
        <article>
          <h3 className="text-xl mb-3">Print Series</h3>
          <p className="text-xs text-primary mb-3">
            2024 · Digitale Illustration · 13 Zeichnungen
          </p>
          <p className="text-muted-foreground">
            Anders als ich und doch sehr nah.
          </p>
        </article>
      </section>
      {/* Divider */}
      <div className="container">
        <div className="divider-line" />
      </div>

      {/* Gallery Grid */}
      <section className="container">
        {illustrations.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <p className="text-lg">Werke werden demnächst hinzugefügt.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {illustrations.map((artwork) => (
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

      {/* Bottom spacing */}
      <div className="py-16" />
    </Layout>
  );
}
