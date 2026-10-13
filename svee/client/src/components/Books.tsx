import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import BookPreview from "./BookPreview";
export default function Books() {
  const { books } = useSiteContent();
  const { language } = useLanguage();
  return (
    <section className="container pb-12 grid lg:grid-cols-2 gap-12">
      {books.map((book) => {
        const title =
          language === "en" ? book.title_en || book.title_de : book.title_de;
        return (
          <article key={book.id} className={!book.cover ? "lg:col-span-2" : ""}>
            {book.cover && (
              <BookPreview
                title={title}
                cover={book.cover}
                teasers={book.teasers}
              />
            )}
            <h3 className="text-2xl mb-3">{title}</h3>
            <p className="text-xs text-primary mb-3">
              {language === "en" ? book.meta_en : book.meta_de}
            </p>
            <p className="text-muted-foreground whitespace-pre-line">
              {language === "en" ? book.description_en : book.description_de}
            </p>
          </article>
        );
      })}
    </section>
  );
}
