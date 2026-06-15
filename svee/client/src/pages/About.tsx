import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

/**
 * About Me Page
 * Design: Minimalist Art Gallery
 * - Clean, elegant layout with artist information
 * - Back navigation to home
 * - Biography and artistic background
 */

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Svea Fritzenkötter
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Künstlerin & Illustratorin
              </p>
            </div>
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Galerie
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="container py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Zurück zur Galerie
        </Link>
      </div>

      {/* About Content */}
      <section className="container pb-16">
        <div className="max-w-3xl">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Über mich
          </h2>

          {/* Divider */}
          <div className="divider-line mb-8"></div>

          {/* Biography */}
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Hallo, ich bin Svea Fritzenkötter, eine leidenschaftliche Künstlerin und Illustratorin aus Deutschland. Meine künstlerische Reise begann schon in meiner Kindheit, wo ich meine Gedanken und Gefühle durch Farben und Linien ausdrückte.
            </p>

            <p>
              Meine Arbeit konzentriert sich auf die Schönheit von Formen, Farben und Bewegung. Ich arbeite mit verschiedenen Techniken – von Acrylmalerei über Aquarelle bis zu digitalen Illustrationen. Jedes Werk ist ein Ausdruck meiner künstlerischen Vision und meiner Verbindung zur Welt um mich herum.
            </p>

            <p>
              Ich bin fasziniert von der Interaktion zwischen Licht und Schatten, von organischen Formen und der Tiefe, die durch Schichtung entsteht. Meine Werke sind oft inspiriert von der Natur, von Emotionen und von den subtilen Momenten des Alltags.
            </p>

            <p>
              Neben meiner künstlerischen Arbeit bin ich auch als Illustratorin tätig und arbeite mit Kunden zusammen, um ihre Visionen zum Leben zu erwecken. Ich glaube, dass Kunst eine universelle Sprache ist, die Menschen verbindet und inspiriert.
            </p>
          </div>

          {/* Divider */}
          <div className="divider-line my-8"></div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Kontaktinformationen
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>
                <span className="font-semibold text-foreground">E-Mail:</span>{" "}
                <a href="mailto:svea@example.com" className="text-primary hover:underline">
                  svea@example.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-foreground">Telefon:</span>{" "}
                <a href="tel:+49123456789" className="text-primary hover:underline">
                  +49 (0) 123 456789
                </a>
              </p>
              <p>
                <span className="font-semibold text-foreground">Standort:</span> Deutschland
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-16">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Svea Fritzenkötter. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:svea@example.com"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                E-Mail
              </a>
              <a
                href="#"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
