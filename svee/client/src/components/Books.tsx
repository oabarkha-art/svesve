import { useSiteContent, safeImage } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
export default function Books() {
  const { books } = useSiteContent();
  const { language, t } = useLanguage();
  return (
    <section className="container book-projects">
      {books.map((book) => {
        const title =
          language === "en" ? book.title_en || book.title_de : book.title_de;
        return (
          <article key={book.id} className="book-project">
            {safeImage(book.cover) && (
              <a
                href={safeImage(book.cover)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("{title}: Buchansicht vergrößern (neuer Tab)", {
                  title,
                })}
                className="project-mockup"
              >
                <img
                  src={safeImage(book.cover)}
                  alt={t("Buchmockup: {title}", { title })}
                  loading="lazy"
                />
              </a>
            )}
            <div className="project-copy">
              <h3 className="text-2xl mb-3">{title}</h3>
              <p className="text-sm mb-4">
                {language === "en" ? book.meta_en : book.meta_de}
              </p>
              <p className="text-muted-foreground whitespace-pre-line">
                {language === "en" ? book.description_en : book.description_de}
              </p>
            </div>
            <div className="project-illustrations">
              {book.teasers
                .filter((src) => safeImage(src))
                .map((src, index) => (
                  <a
                    key={src + index}
                    href={safeImage(src)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(
                      "{title}: Einblick {page} vergrößern (neuer Tab)",
                      { title, page: index + 1 },
                    )}
                  >
                    <img
                      src={safeImage(src)}
                      alt={t("Innenseiten aus {title}, Einblick {page}", {
                        title,
                        page: index + 1,
                      })}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
