import { useLanguage } from "@/contexts/LanguageContext";
import BookPreview from "@/components/BookPreview";
import Layout from "@/components/Layout";
import { illustrations } from "@/data/artworks";
import { Link } from "wouter";
export default function Illustration() {
  const { t } = useLanguage();
  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <p className="text-sm tracking-widest uppercase text-primary mb-3 font-medium">
          {" " + t("Kategorie") + " "}
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
          Illustration
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {" " +
            t(
              "Mir ist es wichtig, dass meine digitalen Illustrationen ein warmes, lebendiges Gef\xFChl vermitteln.",
            ) +
            " "}
        </p>
      </section>

      <section className="container pb-12 grid lg:grid-cols-2 gap-12">
        <article>
          <BookPreview
            title="Ich wünschte, ich hätte eine Schwester"
            slug="schwester"
          />
          <h3 className="text-2xl mb-3">
            Ich wünschte, ich hätte eine Schwester
          </h3>
          <p className="text-xs text-primary mb-3">
            {" " + t("2026 \xB7 Digitale Illustration \xB7 22 Seiten") + " "}
          </p>
          <p className="text-muted-foreground">
            {" " +
              t(
                "Ein M\xE4dchen hat Geburtstag. Sie w\xFCnscht sich eine kleine Schwester und stellt sich vor, in welch wunderbaren Abenteuern die beiden zusammen unterwegs w\xE4ren. Sie spielen Verstecken, sind Piratinnen und Meerjungfrauen und trinken zusammen Tee im verwunschenen Garten.",
              ) +
              " "}
          </p>
        </article>
        <article>
          <BookPreview title="Secret little laws" slug="secret-laws" />
          <h3 className="text-2xl mb-3">Secret little laws</h3>
          <p className="text-xs text-primary mb-3">
            {" " + t("2026 \xB7 Digitale Illustration") + " "}
          </p>
          <p className="text-muted-foreground">
            {" " +
              t(
                "Wusstest du, dass es kleine geheime Gesetze gibt, die nur Kinder verstehen k\xF6nnen? In diesem B\xFCchlein werden ein paar von ihnen verraten.",
              ) +
              " "}
          </p>
        </article>
        <article className="lg:col-span-2">
          <h3 className="text-2xl mb-3">Print Series</h3>
          <p className="text-xs text-primary mb-3">
            {" " +
              t("2024 \xB7 Digitale Illustration \xB7 13 Zeichnungen") +
              " "}
          </p>
          <p className="text-muted-foreground">
            {" " + t("Anders als ich und doch sehr nah.") + " "}
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
            <p className="text-lg">
              {t("Werke werden demn\xE4chst hinzugef\xFCgt.")}
            </p>
          </div>
        ) : (
          <div className="gallery-masonry">
            {illustrations.map((artwork) => (
              <div key={artwork.id} className="artwork-card">
                {/* Artwork Image */}
                <div className="overflow-hidden rounded-sm bg-muted">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    loading="lazy"
                    decoding="async"
                    className="artwork-image"
                  />
                </div>

                {/* Artwork Info */}
                <div className="artwork-info">
                  <div>
                    <h3 className="artwork-title">{artwork.title}</h3>
                    {artwork.dimensions && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {artwork.dimensions}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/prints?werk=${artwork.id}`}
                    className="text-primary underline underline-offset-4 text-sm"
                  >
                    {" " + t("Als Print entdecken \u2192") + " "}
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
