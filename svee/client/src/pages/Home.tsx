import { useSiteSettings } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import Layout from "@/components/Layout";
export default function Home() {
  const { image } = useSiteSettings();
  const { t } = useLanguage();
  return (
    <Layout>
      <section className="w-full">
        <img
          src={image("home.banner")}
          alt=""
          width={2048}
          height={844}
          fetchPriority="high"
          className="home-banner"
        />
        <div className="container">
          <div className="max-w-3xl py-8 md:py-12">
            <h2 className="text-4xl md:text-5xl font-medium mb-5">
              {t("Hey, ich bin Svea")}
            </h2>
            <p className="text-lg leading-relaxed">
              {" " +
                t(
                  "Ich bin Illustratorin und Malerin. Ich liebe es, fantastische Welten zum Leben zu erwecken.",
                ) +
                " "}
            </p>
            <p className="text-lg mt-4">{t("Schön, dass du hier bist!")}</p>
          </div>
        </div>
      </section>
      <section className="container flex flex-col gap-8 pb-12">
        <div>
          <p className="mb-4">{t("Für meine Lübecker:innen ♡")}</p>
          <p className="text-lg leading-relaxed">
            {" " +
              t(
                "Ab dem 20. Oktober ist der diesj\xE4hrige Zonta Adventskalender mit meinem Motiv erh\xE4ltlich.",
              ) +
              " "}
          </p>
        </div>
        <img
          src={image("home.news")}
          alt={t(
            "Kinder am Fenster mit Blick auf L\xFCbecker Kirchen im Winter",
          )}
          width={1800}
          height={1272}
          decoding="async"
          className="w-full h-auto"
        />
        <div className="w-full">
          <h3 className="text-2xl mt-8 mb-4">{t("Zusammenarbeit")}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {" " +
              t(
                "Einige meiner liebsten Kooperationen: Zonta Club \xB7 Johanniter \xB7 GEOMAR Helmholtz-Zentrum f\xFCr Ozeanforschung",
              ) +
              " "}
          </p>
        </div>
      </section>
      <section className="container py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/malerei" className="group">
            <img
              src={image("home.painting")}
              alt={t("Malerei")}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
            <h3 className="text-3xl mt-4 group-hover:text-primary">
              {t("Malerei \u2192")}
            </h3>
          </Link>
          <Link href="/illustration" className="group">
            <img
              src={image("home.illustration")}
              alt={t("Illustration")}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
            <h3 className="text-3xl mt-4 group-hover:text-primary">
              {t("Illustration →")}
            </h3>
          </Link>
        </div>
      </section>
      <section className="container py-12">
        <h3 className="text-3xl mb-5">
          {t("Ein St\xFCck meiner Welt f\xFCr dein Zuhause.")}
        </h3>
        <Link className="shop-button" href="/prints">
          {t("Prints entdecken \u2192")}
        </Link>
      </section>
    </Layout>
  );
}
