import { useLanguage } from "@/contexts/LanguageContext";
import TikTokIcon from "@/components/TikTokIcon";
import { inquiryLink } from "@/lib/contact";
import { Link, useLocation } from "wouter";
import { Instagram } from "lucide-react";
import Cart from "@/components/Cart";
interface LayoutProps {
  children: React.ReactNode;
}
const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/malerei",
    label: "Malerei",
  },
  {
    href: "/illustration",
    label: "Illustration",
  },
  {
    href: "/prints",
    label: "Prints",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
  },
];
export default function Layout({ children }: LayoutProps) {
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Logo / Name */}
            <Link href="/">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Svea Fritzenkötter
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 tracking-widest uppercase">
                  {" " + t("K\xFCnstlerin & Illustratorin") + " "}
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav
              className="flex flex-wrap items-center gap-4 md:gap-6"
              aria-label={t("Hauptnavigation")}
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location === "/"
                    : location.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm md:text-base transition-colors relative pb-0.5 ${isActive ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary" : "text-foreground hover:text-primary"}`}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}
              <div
                className="flex items-center border border-border rounded-sm"
                role="group"
                aria-label="Sprache / Language"
              >
                {(["de", "en"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    lang={code}
                    aria-pressed={language === code}
                    aria-label={code === "de" ? "Deutsch" : "English"}
                    onClick={() => setLanguage(code)}
                    className={`min-w-11 min-h-11 px-2 text-sm ${language === code ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <Cart />
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-[#332626] text-[#F8F7F3] mt-16">
        <div className="container py-10">
          <p className="text-xl max-w-2xl mb-8 leading-relaxed">
            {" " +
              t(
                "Wenn du mit mir zusammenarbeiten oder mehr von meiner Arbeit entdecken m\xF6chtest, schreib mir. Ich freue mich auf deine Nachricht.",
              ) +
              " "}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#e2d4ce]">
              © {new Date().getFullYear()}
              {" " + t("Svea Fritzenk\xF6tter. Alle Rechte vorbehalten.") + " "}
            </p>
            <div className="flex items-center gap-6">
              <a
                href={inquiryLink()}
                className="text-sm text-[#F8F7F3] hover:underline transition-colors"
              >
                {" " + t("E-Mail") + " "}
              </a>
              <a
                href="https://www.instagram.com/svea_syy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#F8F7F3] hover:underline transition-colors"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@sveasyy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-w-11 min-h-11"
                aria-label="TikTok: @sveasyy"
                title="TikTok: @sveasyy"
              >
                <TikTokIcon size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
