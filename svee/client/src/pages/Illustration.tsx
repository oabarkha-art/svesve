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
          <div className="project-illustrations">
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-16">
        <Link href="/prints" className="shop-button">
          {t("Prints entdecken →")}
        </Link>
      </section>
      {/* Bottom spacing */}
      <div className="py-16" />
    </Layout>
  );
}
