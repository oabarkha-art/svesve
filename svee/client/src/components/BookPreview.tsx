import { useLanguage } from "@/contexts/LanguageContext";
interface BookPreviewProps {
  title: string;
  slug: string;
}
export default function BookPreview({ title, slug }: BookPreviewProps) {
  const { t } = useLanguage();
  return (
    <div
      className="book-preview"
      aria-label={t("Einblicke in {title}", { title })}
    >
      <a
        href={`/images/books/${slug}-cover.webp`}
        target="_blank"
        rel="noopener noreferrer"
        className="book-cover"
        aria-label={t("{title}: Buchansicht vergrößern (neuer Tab)", { title })}
      >
        <img
          src={`/images/books/${slug}-cover.webp`}
          alt={t("Buchmockup: {title}", { title })}
          loading="lazy"
          decoding="async"
        />
      </a>
      {[1, 2, 3, 4].map((page) => (
        <a
          key={page}
          href={`/images/books/${slug}-${page}.webp`}
          target="_blank"
          rel="noopener noreferrer"
          className={`book-teaser book-teaser-${page}`}
          aria-label={t("{title}: Einblick {page} vergrößern (neuer Tab)", {
            title,
            page,
          })}
        >
          <img
            src={`/images/books/${slug}-${page}.webp`}
            alt={t("Innenseiten aus {title}, Einblick {page}", { title, page })}
            loading="lazy"
            decoding="async"
          />
        </a>
      ))}
    </div>
  );
}
