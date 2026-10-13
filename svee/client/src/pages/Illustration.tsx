import { useLanguage } from "@/contexts/LanguageContext";
import Books from "@/components/Books";
import Layout from "@/components/Layout";
import { useCatalog } from "@/contexts/CatalogContext";
import { Link } from "wouter";
export default function Illustration() {
  const { t } = useLanguage();
  const { artworks } = useCatalog();
  const illustrations = artworks.filter(
    (a) => a.gallery && a.category === "illustration",
  );
  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <p className="text-sm tracking-widest uppercase text-primary mb-3 font-medium">
          {" " + t("Kategorie") + " "}
        </p>
        <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
          {t("Illustration")}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {" " +
            t(
              "Mir ist es wichtig, dass meine digitalen Illustrationen ein warmes, lebendiges Gef\xFChl vermitteln.",
            ) +
            " "}
        </p>
      </section>

      <Books />
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
