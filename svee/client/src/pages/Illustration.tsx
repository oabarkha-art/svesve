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

const illustrations: Artwork[] = [
  {
    id: 1,
    title: "Stille Natur",
    description:
      "Eine zarte Illustration der Natur mit Wasserfarben. Botanische Elemente in sanften, gedämpften Farben.",
    image: "/images/illustration-nature.png",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: 2,
    title: "Porträt",
    description:
      "Eine künstlerische Porträt-Illustration mit warmen, gedämpften Tönen. Elegante und ausdrucksstarke Linienführung.",
    image: "/images/illustration-portrait.png",
    year: "2023",
    technique: "Digitale Illustration",
  },
  {
    id: 3,
    title: "Kirschen",
    description:
      "Ein Kind greift nach Kirschen, in kühlen Blautönen gemalt. Eine ruhige, verträumte Momentaufnahme.",
    image: "/images/illustration-kirschen.jpg",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: 4,
    title: "Skizze in Bewegung",
    description:
      "Zwei skizzierte Figuren vor einem lebhaften, farbenfrohen Hintergrund. Spontane Linien treffen auf warme Farbflächen.",
    image: "/images/illustration-skizze-figuren.jpg",
    year: "2024",
    technique: "Mischtechnik",
  },
  {
    id: 5,
    title: "Mit Hund",
    description:
      "Ein Mädchen liest, während ein gefleckter Hund neugierig danebensteht. Zarte Tusche- und Aquarelltöne in Grau.",
    image: "/images/illustration-hund-maedchen.jpg",
    year: "2024",
    technique: "Tusche & Aquarell",
  },
  {
    id: 6,
    title: "Unter Hasen",
    description:
      "Zwei Kinder inmitten einer Schar von Hasen, in dunklem Grün getaucht. Eine stille, geheimnisvolle Szene.",
    image: "/images/illustration-hasen.jpg",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: 7,
    title: "Verbunden",
    description:
      "Vier Figuren, verbunden durch ein rotes Band – eine verspielte Studie über Nähe und Bewegung.",
    image: "/images/illustration-tanz.png",
    year: "2024",
    technique: "Federzeichnung",
  },
  {
    id: 8,
    title: "Mädchen mit Leopard",
    description:
      "Ein Mädchen wandert an der Seite eines großen, gepunkteten Leoparden. Sanftes Rosa trägt die Szene.",
    image: "/images/illustration-leopard.png",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: 9,
    title: "Giraffenausflug",
    description:
      "Eine Giraffe auf einer Spazierfahrt im Cabrio, umgeben von zarten Pflanzenmotiven in warmem Gelb.",
    image: "/images/illustration-giraffe.png",
    year: "2024",
    technique: "Aquarell & Digital",
  },
];

export default function Illustration() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
          Handgezeichnete und digitale Illustrationen – von botanischen
          Aquarellen bis zu ausdrucksstarken Porträts.
        </p>
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
