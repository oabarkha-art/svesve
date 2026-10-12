import { useLanguage } from "@/contexts/LanguageContext";
import TikTokIcon from "@/components/TikTokIcon";
import { artistEmail, inquiryLink } from "@/lib/contact";
import { Mail, Instagram } from "lucide-react";
import Layout from "@/components/Layout";
export default function Contact() {
  const { t } = useLanguage();
  return (
    <Layout>
      <section className="container py-16 md:py-24 max-w-3xl">
        <p className="eyebrow">{t("Kontakt")}</p>
        <h2 className="text-4xl md:text-5xl mb-6">{t("Lass uns sprechen.")}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          {" " +
            t(
              "Du bist neugierig auf meine Arbeit, hast eine Idee f\xFCr eine Zusammenarbeit oder einfach Lust auf ein Gespr\xE4ch? Lass uns einen Kaffee trinken und reden! Ich freue mich, von dir zu h\xF6ren.",
            ) +
            " "}
        </p>
        <a
          className="shop-button inline-flex items-center gap-3"
          href={inquiryLink()}
        >
          <Mail size={18} />
          {artistEmail}
        </a>
        <p className="mt-8 text-muted-foreground">{t("Deutschland")}</p>
        <div className="flex flex-wrap gap-6 mt-8">
          <a
            href="https://www.instagram.com/svea_syy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary"
          >
            <Instagram size={18} />
            @svea_syy
          </a>
          <a
            href="https://www.tiktok.com/@sveasyy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-w-11 min-h-11 text-primary"
            aria-label="TikTok: @sveasyy"
            title="TikTok: @sveasyy"
          >
            <TikTokIcon size={24} />
          </a>
        </div>
      </section>
    </Layout>
  );
}
