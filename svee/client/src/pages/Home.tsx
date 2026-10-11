import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm tracking-widest uppercase text-primary mb-4 font-medium">
            Portfolio
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Hi, ich bin Svea
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Ich bin Illustratorin und Malerin. Ich liebe es, fantastische Welten
            zum Leben zu erwecken. Schön, dass du da bist!
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <Link
              href="/malerei"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              Malerei entdecken
            </Link>
            <Link
              href="/illustration"
              className="px-8 py-3 border border-foreground text-foreground font-medium rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              Illustration ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-line" />
      </div>

      {/* Category Preview Cards */}
      <section className="container py-16 md:py-20">
        <h3 className="text-2xl font-bold text-foreground mb-10">Bereiche</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Malerei Card */}
          <Link href="/malerei">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden mb-5">
                <img
                  src="/images/painting-seerose.webp"
                  alt="Malerei"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-foreground">
                    Malerei
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Öl auf Leinwand
                  </p>
                </div>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Alle ansehen →
                </span>
              </div>
            </div>
          </Link>

          {/* Illustration Card */}
          <Link href="/illustration">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden mb-5">
                <img
                  src="/images/illustration-nature.webp"
                  alt="Illustration"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-foreground">
                    Illustration
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Digital & Handzeichnung
                  </p>
                </div>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Alle ansehen →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-line" />
      </div>

      <section className="container py-12 grid md:grid-cols-2 gap-12">
        <div>
          <p className="eyebrow">Aktuelles</p>
          <h3 className="text-2xl mb-4">Für meine Lübecker:innen ♡</h3>
          <p className="text-muted-foreground max-w-xl">
            Ab dem 20. Oktober ist der diesjährige Zonta Adventskalender mit
            meinem Motiv erhältlich.
          </p>
        </div>
        <div>
          <p className="eyebrow">Zusammenarbeit</p>
          <h3 className="text-2xl mb-4">
            Einige meiner liebsten Kooperationen
          </h3>
          <p className="text-muted-foreground">
            Zonta Club · Johanniter · GEOMAR Helmholtz-Zentrum für
            Ozeanforschung
          </p>
        </div>
      </section>
      <section className="container py-12">
        <div className="bg-muted/50 p-8 md:p-12 rounded-sm">
          <h3 className="text-3xl mb-4">
            Ein Stück meiner Welt für dein Zuhause.
          </h3>
          <p className="text-muted-foreground mb-6">
            Entdecke meine Malerei und Illustrationen als handsignierte Prints.
          </p>
          <Link className="shop-button" href="/prints">
            Prints entdecken →
          </Link>
        </div>
      </section>
      {/* Contact CTA */}
      <section className="container py-16 md:py-20 text-center">
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Interesse an einer Zusammenarbeit?
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Ob Auftragsarbeit, Ausstellung oder eine andere Anfrage – ich freue
          mich, von dir zu hören.
        </p>
        <Link
          href="/kontakt"
          className="inline-block px-10 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors"
        >
          Kontakt aufnehmen
        </Link>
      </section>
    </Layout>
  );
}
