import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { useCatalog } from "@/contexts/CatalogContext";
import { useContact } from "@/lib/useContact";
export default function Malerei() {
  const { inquiryLink } = useContact();
  const { t } = useLanguage();
  const { artworks } = useCatalog();
  const paintings = artworks.filter(
    (a) => a.gallery && a.category === "malerei" && a.id !== "painting-sami",
  );
  const sami = artworks.find((a) => a.id === "painting-sami");
  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
          {" " + t("Malerei") + " "}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {" " +
            t(
              "Abends sitze ich meistens in meinem kleinen Atelier und male. Ich benutze daf\xFCr \xD6lfarben, ein Material, das eine lange Geschichte hat. Es ist warm und weich, f\xFCgt sich ineinander und gibt den Bildern vertraute Tiefe. Meine Motive erz\xE4hlen von Menschen und ihren Beziehungen zueinander und zu der fantastischen Welt, in der wir leben.",
            ) +
            " "}
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
            <p className="text-lg">
              {t("Werke werden demn\xE4chst hinzugef\xFCgt.")}
            </p>
          </div>
        ) : (
          <div className="gallery-masonry painting-gallery">
            {paintings.map((artwork) => (
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
                    {(artwork.year || artwork.dimensions) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {[artwork.year, artwork.dimensions]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  {artwork.sold ? (
                    <p className="text-sm text-primary">{t("Sold")}</p>
                  ) : (
                    <a
                      href={inquiryLink(`Request painting: ${artwork.title}`)}
                      aria-label={`Request painting: ${artwork.title}`}
                      className="text-primary underline underline-offset-4 text-sm"
                    >
                      {t("Request painting")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container portrait-section py-16">
        {sami && (
          <img
            src={sami.image}
            alt={sami.title}
            loading="lazy"
            className="portrait-image"
          />
        )}
        <div>
          <h3 className="text-2xl mb-4">{t("Ein Portr\xE4t f\xFCr dich")}</h3>
          <p className="text-muted-foreground mb-6">
            {" " +
              t(
                "Du w\xFCnschst dir ein individuell handgemaltes Portr\xE4t als Geschenk f\xFCr eine Hochzeit oder zu Weihnachten? Schreib mir von deiner Vision! Ich male mit \xD6lfarben auf Leinwand.",
              ) +
              " "}
          </p>
          <a className="shop-button" href={inquiryLink("Anfrage Porträt")}>
            {" " + t("Request painting") + " "}
          </a>
        </div>
      </section>
      {/* Bottom spacing */}
      <div className="py-16" />
    </Layout>
  );
}
