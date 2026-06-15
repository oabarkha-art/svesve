import { Link, useLocation } from "wouter";
import { Instagram } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/malerei", label: "Malerei" },
  { href: "/illustration", label: "Illustration" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            {/* Logo / Name */}
            <Link href="/">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Svea Fritzenkötter
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 tracking-widest uppercase">
                  Künstlerin & Illustratorin
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6 md:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location === "/"
                    : location.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm md:text-base transition-colors relative pb-0.5 ${
                      isActive
                        ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-16">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Svea Fritzenkötter. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:abarkha@outlook.com"
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                E-Mail
              </a>
              <a
                href="https://www.instagram.com/svea_syy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Instagram size={16} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
