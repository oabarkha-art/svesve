import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { artworks, money, printPrices } from "@/data/artworks";
import { useCart, itemKey } from "@/contexts/CartContext";
export default function Cart() {
  const { t } = useLanguage();
  const cart = useCart();
  return (
    <>
      <button
        type="button"
        className="cart-toggle"
        onClick={() => cart.setOpen(true)}
        aria-label={t("Warenkorb öffnen, {count} Prints", {
          count: cart.count,
        })}
      >
        <ShoppingBag size={21} />
        <span>{cart.count}</span>
      </button>
      <Sheet open={cart.open} onOpenChange={cart.setOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg p-6">
          <SheetHeader className="p-0 pr-6">
            <SheetTitle>{t("Dein Warenkorb")}</SheetTitle>
            <SheetDescription>
              {" " + t("Handsignierte Prints f\xFCr dein Zuhause.") + " "}
            </SheetDescription>
          </SheetHeader>
          {cart.items.length === 0 ? (
            <div className="py-12">
              <p className="mb-6">{t("Dein Warenkorb ist noch leer.")}</p>
              <Link
                href="/prints"
                className="shop-button"
                onClick={() => cart.setOpen(false)}
              >
                {" " + t("Prints entdecken") + " "}
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto divide-y divide-border my-4">
                {cart.items.map((item) => {
                  const artwork = artworks.find(
                    (a) => a.id === item.artworkId,
                  )!;
                  const id = itemKey(item);
                  return (
                    <li key={id} className="flex gap-4 py-5">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-20 h-24 object-contain bg-muted"
                      />
                      <div className="flex-1">
                        <h3 className="text-base">{artwork.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.format} · {money(printPrices[item.format])}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            className="quantity-button"
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => cart.update(id, item.quantity - 1)}
                            aria-label={t("Ein Print weniger: {title}", {
                              title: artwork.title,
                            })}
                          >
                            <Minus size={14} />
                          </button>
                          <span aria-live="polite">{item.quantity}</span>
                          <button
                            className="quantity-button"
                            type="button"
                            disabled={item.quantity >= 20}
                            onClick={() => cart.update(id, item.quantity + 1)}
                            aria-label={t("Ein Print mehr: {title}", {
                              title: artwork.title,
                            })}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            className="ml-auto p-2"
                            type="button"
                            onClick={() => cart.remove(id)}
                            aria-label={t(
                              "{title} aus dem Warenkorb entfernen",
                              { title: artwork.title },
                            )}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap">
                        {money(printPrices[item.format] * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border pt-5">
                <p className="flex justify-between text-lg mb-2">
                  <span>{t("Prints gesamt")}</span>
                  <strong>{money(cart.total)}</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  {" " +
                    t(
                      "Versandkosten teile ich dir mit meinem Angebot mit. Die Anfrage ist unverbindlich.",
                    ) +
                    " "}
                </p>
                <Link
                  href="/kasse"
                  className="shop-button w-full text-center"
                  onClick={() => cart.setOpen(false)}
                >
                  {" " + t("Zur Bestellanfrage \u2192") + " "}
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
