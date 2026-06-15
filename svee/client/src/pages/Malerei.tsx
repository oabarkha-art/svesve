import { useState } from "react";
import Layout from "@/components/Layout";

interface Artwork {
  id: number;
  title: string;
  description: string;
  image: string;
  year: string;
  technique: string;
}

const paintings: Artwork[] = [
  {
    id: 1,
    title: "Fließende Formen",
    description:
      "Eine abstrakte Komposition mit fließenden Formen in warmen Erdtönen. Die Schichten schaffen Tiefe und Bewegung.",
    image: "/images/hero-abstract-art.png",
    year: "2024",
    technique: "Acryl auf Leinwand",
  },
  {
    id: 2,
    title: "Goldene Stunde",
    description:
      "Eine expressive Landschaftsmalerei zur Sonnenuntergangszeit. Moderne Impressionist-Technik mit sichtbaren Pinselstrichen.",
    image: "/images/painting-landscape.png",
    year: "2023",
    technique: "Öl auf Leinwand",
  },
  // Weitere Gemälde hier hinzufügen
];

export default function Malerei() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
          Eine Auswahl meiner Gemälde in verschiedenen Techniken – von
          expressiver Acrylmalerei bis zu klassischen Ölgemälden.
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
                      {artwork.year} — {artwork.technique}
                    </p>
                  </div>
                  <p className="artwork-description">{artwork.description}</p>
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
