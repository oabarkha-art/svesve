import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="container pt-8 md:pt-12">
        <img src="/images/home-banner.webp" alt="" width={2048} height={844}
          fetchPriority="high" className="w-full h-auto" />
        <div className="max-w-3xl py-8 md:py-12">
          <h2 className="text-4xl md:text-5xl font-medium mb-5">Hi, ich bin Svea</h2>
          <p className="text-lg leading-relaxed">
            Ich bin Illustratorin und Malerin. Ich liebe es, fantastische Welten
            zum Leben zu erwecken.
          </p>
          <p className="text-lg mt-4">Schön, dass du da bist!</p>
        </div>
      </section>
      <section className="container grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-center pb-12">
        <div>
          <h3 className="text-2xl mb-4">Aktuelles</h3>
          <p className="text-lg leading-relaxed">
            Für meine Lübecker:innen ♡ Ab dem 20. Oktober ist der diesjährige
            Zonta Adventskalender mit meinem Motiv erhältlich.
          </p>
          <h3 className="text-2xl mt-8 mb-4">Zusammenarbeit</h3>
          <p className="text-muted-foreground leading-relaxed">
            Einige meiner liebsten Kooperationen: Zonta Club · Johanniter ·
            GEOMAR Helmholtz-Zentrum für Ozeanforschung
          </p>
        </div>
        <img src="/images/home-zonta.webp"
          alt="Kinder am Fenster mit Blick auf Lübecker Kirchen im Winter"
          width={1800} height={1272} decoding="async" className="w-full h-auto" />
      </section>
      <section className="container py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/malerei" className="group">
            <img src="/images/painting-seerose.webp" alt="Seerose" loading="lazy"
              className="w-full aspect-[4/3] object-cover" />
            <h3 className="text-3xl mt-4 group-hover:text-primary">Malerei →</h3>
          </Link>
          <Link href="/illustration" className="group">
            <img src="/images/illustration-hasen.jpg" alt="Unter Hasen" loading="lazy"
              className="w-full aspect-[4/3] object-cover" />
            <h3 className="text-3xl mt-4 group-hover:text-primary">Illustration →</h3>
          </Link>
        </div>
      </section>
      <section className="container py-12">
        <h3 className="text-3xl mb-5">Ein Stück meiner Welt für dein Zuhause.</h3>
        <Link className="shop-button" href="/prints">Prints entdecken →</Link>
      </section>
    </Layout>
  );
}
