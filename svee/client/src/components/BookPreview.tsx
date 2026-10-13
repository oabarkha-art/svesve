import { safeImage } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
interface BookPreviewProps {
  title: string;
  cover: string;
  teasers: string[];
}
export default function BookPreview({
  title,
  cover,
  teasers,
}: BookPreviewProps) {
  const { t } = useLanguage();
  return (
    <div
      className="book-preview"
      aria-label={t("Einblicke in {title}", { title })}
    >
      <a
        href={safeImage(cover)}
        target="_blank"
        rel="noopener noreferrer"
        className="book-cover"
        aria-label={t("{title}: Buchansicht vergrößern (neuer Tab)", { title })}
      >
        <img
          src={safeImage(cover)}
          alt={t("Buchmockup: {title}", { title })}
          loading="lazy"
          decoding="async"
        />
      </a>
      {teasers
        .filter((src) => safeImage(src))
        .slice(0, 4)
        .map((src, index) => {
          const page = index + 1;
          return (
            <a
              key={page}
              href={safeImage(src)}
              target="_blank"
              rel="noopener noreferrer"
              className={`book-teaser book-teaser-${page}`}
              aria-label={t("{title}: Einblick {page} vergrößern (neuer Tab)", {
                title,
                page,
              })}
            >
              <img
                src={safeImage(src)}
                alt={t("Innenseiten aus {title}, Einblick {page}", {
                  title,
                  page,
                })}
                loading="lazy"
                decoding="async"
              />
            </a>
          );
        })}
    </div>
  );
}
