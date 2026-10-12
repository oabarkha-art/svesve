import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  artworks as seed,
  printPrices as initialPrices,
  type Artwork,
  type PrintFormat,
} from "@/data/artworks";
export interface CatalogArtwork extends Artwork {
  gallery: boolean;
  published: boolean;
  sort_order: number;
}
const initial = seed.map((a, i) => ({
  ...a,
  gallery: !a.id.startsWith("print-"),
  published: true,
  sort_order: i,
}));
const CatalogContext = createContext({
  artworks: initial,
  printPrices: initialPrices,
  ready: !supabase,
  error: "",
  reload: async () => {},
});
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [artworks, setArtworks] = useState<CatalogArtwork[]>(
    supabase ? [] : initial,
  );
  const [printPrices, setPrices] = useState(initialPrices);
  const [ready, setReady] = useState(!supabase);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    if (!supabase) return;
    try {
      const [a, p] = await Promise.all([
        supabase
          .from("artworks")
          .select("*")
          .eq("published", true)
          .order("sort_order"),
        supabase.from("print_prices").select("*"),
      ]);
      if (a.error || p.error) throw new Error("catalog");
      const prices = Object.fromEntries(
        p.data.map((r) => [r.format, r.cents]),
      ) as Record<PrintFormat, number>;
      if (
        !["A5", "A4", "A3"].every((k) =>
          Number.isInteger(prices[k as PrintFormat]),
        )
      )
        throw new Error("prices");
      setArtworks(a.data as CatalogArtwork[]);
      setPrices(prices);
      setReady(true);
      setError("");
    } catch {
      setError(
        "Der Katalog konnte nicht aktualisiert werden. / Could not update the catalogue.",
      );
      setReady(false);
    }
  }, []);
  useEffect(() => {
    void reload();
    const refresh = () => void reload();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [reload]);
  return (
    <CatalogContext.Provider
      value={{ artworks, printPrices, ready, error, reload }}
    >
      {children}
    </CatalogContext.Provider>
  );
}
export const useCatalog = () => useContext(CatalogContext);
