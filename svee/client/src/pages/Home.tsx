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
            Kunst, die
            <br />
            bewegt.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Willkommen in meinem Portfolio. Ich bin Svea Fritzenkötter –
            Künstlerin und Illustratorin aus Deutschland. Hier zeige ich eine
            Auswahl meiner Gemälde und Illustrationen.
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
        <h3 className="text-2xl font-bold text-foreground mb-10">
          Bereiche
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Malerei Card */}
          <Link href="/malerei">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden mb-5">
                <img
                  src="/images/painting-landscape.png"
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
                    Acryl, Öl & Aquarell
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
                  src="/images/illustration-nature.png"
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

      {/* Contact CTA */}
      <section className="container py-16 md:py-20 text-center">
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Interesse an einer Zusammenarbeit?
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Ob Commission, Ausstellung oder eine andere Anfrage – ich freue mich
          von Ihnen zu hören.
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
