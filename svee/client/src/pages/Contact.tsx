import { artistEmail, inquiryLink } from "@/lib/contact";
import { Mail, Instagram } from "lucide-react";
import Layout from "@/components/Layout";
export default function Contact() {
  return (
    <Layout>
      <section className="container py-16 md:py-24 max-w-3xl">
        <p className="eyebrow">Kontakt</p>
        <h2 className="text-4xl md:text-5xl mb-6">Lass uns sprechen.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Du bist neugierig auf meine Arbeit, hast eine Idee für eine
          Zusammenarbeit oder einfach Lust auf ein Gespräch? Lass uns einen
          Kaffee trinken und reden! Ich freue mich, von dir zu hören.
        </p>
        <a
          className="shop-button inline-flex items-center gap-3"
          href={inquiryLink()}
        >
          <Mail size={18} />
          {artistEmail}
        </a>
        <p className="mt-8 text-muted-foreground">Deutschland</p>
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
            className="text-primary"
          >
            TikTok @sveasyy
          </a>
        </div>
      </section>
    </Layout>
  );
}
