import { useState } from "react";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Bitte geben Sie Ihren Namen ein");
    if (!formData.email.trim()) return toast.error("Bitte geben Sie Ihre E-Mail-Adresse ein");
    if (!formData.message.trim()) return toast.error("Bitte geben Sie eine Nachricht ein");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Vielen Dank! Ihre Nachricht wurde gesendet.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="container py-12 md:py-16">
        <p className="text-sm tracking-widest uppercase text-primary mb-3 font-medium">
          Kontakt
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Schreiben Sie mir
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Ob Commission, Kooperation oder eine Frage zu meiner Arbeit – ich
          freue mich über jede Nachricht.
        </p>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-line" />
      </div>

      {/* Content */}
      <section className="container py-12 pb-16">
        <div className="grid md:grid-cols-2 gap-16">

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Formular
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ihr Name"
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  E-Mail
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ihre@email.de"
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Betreff
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                >
                  <option value="">Bitte wählen …</option>
                  <option value="commission">Commission / Auftragsarbeit</option>
                  <option value="kauf">Kauf eines Werkes</option>
                  <option value="kooperation">Kooperation</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nachricht
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ihre Nachricht …"
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Wird gesendet …" : "Nachricht senden"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Direkt erreichen
            </h3>

            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">E-Mail</p>
                  <a
                    href="mailto:abarkha@outlook.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    abarkha@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Telefon</p>
                  <a
                    href="tel:+4917634440813"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +49 (0) 176 34440813
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Standort</p>
                  <p className="text-muted-foreground">Deutschland</p>
                </div>
              </div>
            </div>

            <div className="divider-line my-8" />

            {/* Social */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-widest uppercase">
                Social Media
              </h4>
              <a
                href="https://www.instagram.com/svea_syy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <Instagram size={20} />
                <span>@svea_syy</span>
              </a>
            </div>

            {/* Note */}
            <div className="mt-10 p-5 bg-muted rounded-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ich antworte in der Regel innerhalb von 1–3 Werktagen. Für
                dringende Anfragen stehen Sie mir gerne auch telefonisch zur
                Verfügung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
