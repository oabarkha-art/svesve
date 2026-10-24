import { useSiteContent } from "./SiteContentContext";
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
  overrides: Record<string, { de: string; en: string }> = {},
) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const translated =
    overrides[normalized]?.[language] ??
    (language === "en"
      ? ((english as Record<string, string>)[normalized] ?? text)
      : text);
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
  const { fields } = useSiteContent();
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const requested = new URLSearchParams(window.location.search).get("lang");
      const saved = requested || localStorage.getItem("svea-language");
      return saved === "de" ? "de" : "en";
    } catch {
      return "en";
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
  }, [language]);
  const t = useCallback(
    (text: string, values?: Values) =>
      translate(language, text, values, fields),
    [language, fields],
  );
  useEffect(() => {
    document.title = t("Portfolio · Svea Fritzenkötter");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          "Malerei und Illustration von Svea Fritzenkötter. Entdecke Ölgemälde, fantastische Welten und handsignierte Prints.",
        ),
      );
  }, [t]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
