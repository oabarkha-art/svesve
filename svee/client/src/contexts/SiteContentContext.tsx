import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { initialContent, initialBooks } from "@/data/siteContent";
export interface ContentField {
  key: string;
  section: string;
  kind: string;
  de: string;
  en: string;
}
export interface Book {
  id: string;
  title_de: string;
  title_en: string;
  meta_de: string;
  meta_en: string;
  description_de: string;
  description_en: string;
  cover: string;
  teasers: string[];
  published: boolean;
  sort_order: number;
}
const defaults = Object.fromEntries(initialContent.map((r) => [r.key, r]));
export const safeImage = (value: string) =>
  typeof value === "string" &&
  (value.startsWith("/images/") || /^https:\/\//i.test(value))
    ? value
    : "";
export const safeLink = (value: string) =>
  /^https:\/\//i.test(value) ? value : "#";
const Context = createContext({
  fields: defaults as Record<string, ContentField>,
  books: initialBooks as Book[],
  error: "",
  reload: async () => {},
});
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Record<string, ContentField>>(defaults);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    if (!supabase) return;
    try {
      const [c, b] = await Promise.all([
        supabase.from("site_content").select("*"),
        supabase
          .from("books")
          .select("*")
          .eq("published", true)
          .order("sort_order"),
      ]);
      if (c.error || b.error) throw new Error();
      setFields(Object.fromEntries(c.data.map((r) => [r.key, r])));
      setBooks(b.data as Book[]);
      setError("");
    } catch {
      setError(
        "Inhalte konnten nicht geladen werden. / Could not load content.",
      );
    }
  }, []);
  useEffect(() => {
    void reload();
    const refresh = () => void reload();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [reload]);
  return (
    <Context.Provider value={{ fields, books, error, reload }}>
      {children}
    </Context.Provider>
  );
}
export const useSiteContent = () => useContext(Context);
export function useSiteSettings() {
  const { fields } = useSiteContent();
  const value = (key: string) => fields[key]?.de ?? defaults[key]?.de ?? "";
  return {
    value,
    image: (key: string) => safeImage(value(key)),
    link: (key: string) => safeLink(value(key)),
  };
}
