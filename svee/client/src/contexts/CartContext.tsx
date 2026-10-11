import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  artworks,
  formats,
  printPrices,
  type PrintFormat,
} from "@/data/artworks";

export interface CartItem {
  artworkId: string;
  format: PrintFormat;
  quantity: number;
}
const key = "svea-print-cart-v1";
export const itemKey = (item: Pick<CartItem, "artworkId" | "format">) =>
  `${item.artworkId}:${item.format}`;
export function restoreCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const item of value.slice(0, 100)) {
    if (
      !item ||
      !artworks.some((a) => a.id === item.artworkId) ||
      !formats.includes(item.format) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )
      continue;
    const found = result.find((i) => itemKey(i) === itemKey(item));
    if (found) found.quantity = Math.min(20, found.quantity + item.quantity);
    else
      result.push({
        artworkId: item.artworkId,
        format: item.format,
        quantity: item.quantity,
      });
  }
  return result;
}
function loadCart() {
  try {
    return restoreCart(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return [];
  }
}
interface CartValue {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (artworkId: string, format: PrintFormat) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* Cart still works without storage. */
    }
  }, [items]);
  const value: CartValue = {
    items,
    open,
    setOpen,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce(
      (sum, item) => sum + printPrices[item.format] * item.quantity,
      0,
    ),
    add: (artworkId, format) => {
      setItems((prev) => {
        const found = prev.find(
          (item) => item.artworkId === artworkId && item.format === format,
        );
        return found
          ? prev.map((item) =>
              item === found
                ? { ...item, quantity: Math.min(20, item.quantity + 1) }
                : item,
            )
          : [...prev, { artworkId, format, quantity: 1 }];
      });
      setOpen(true);
    },
    update: (id, quantity) =>
      setItems((prev) =>
        prev.map((item) =>
          itemKey(item) === id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(20, Math.trunc(quantity) || 1)),
              }
            : item,
        ),
      ),
    remove: (id) =>
      setItems((prev) => prev.filter((item) => itemKey(item) !== id)),
    clear: () => setItems([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider is required");
  return cart;
}
