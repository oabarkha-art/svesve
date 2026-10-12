import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import english from "@/i18n/en.json";
export type Language = "de" | "en";
type Values = Record<string, string | number>;
export function translate(
  language: Language,
  text: string,
  values: Values = {},
) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const translated =
    language === "en"
      ? ((english as Record<string, string>)[normalized] ?? text)
      : text;
  return translated.replace(/\{(\w+)\}/g, (match, key) =>
    String(values[key] ?? match),
  );
}
const LanguageContext = createContext({
  language: "de" as Language,
  setLanguage: (_: Language) => {},
  t: (text: string, values?: Values) => translate("de", text, values),
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const requested = new URLSearchParams(window.location.search).get("lang");
      const saved = requested || localStorage.getItem("svea-language");
      return saved === "en" ? "en" : "de";
    } catch {
      return "de";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", url);
    }
    try {
      localStorage.setItem("svea-language", language);
    } catch {
      /* The switch also works without storage. */
    }
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      language === "en"
        ? "Paintings and illustrations by Svea Fritzenkötter. Explore oil paintings, imaginary worlds and hand-signed prints."
        : "Malerei und Illustration von Svea Fritzenkötter. Entdecke Ölgemälde, fantastische Welten und handsignierte Prints.",
    );
  }, [language]);
  const t = useCallback(
    (text: string, values?: Values) => translate(language, text, values),
    [language],
  );
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
