import { z } from "zod";
import { artworks, formats, printPrices } from "../client/src/data/artworks";

const text = (max: number) => z.string().trim().min(1).max(max);
export const orderSchema = z.object({
  requestId: z.string().uuid(),
  customer: z.object({
    name: text(120),
    email: z.string().trim().email().max(254),
    street: text(200),
    postalCode: text(20),
    city: text(120),
    country: text(80),
    message: z.string().trim().max(2000).default(""),
  }),
  items: z
    .array(
      z.object({
        artworkId: text(100),
        format: z.enum(formats),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(100),
  acknowledged: z.literal(true),
  website: z.string().max(0).optional(),
});
export type OrderInput = z.infer<typeof orderSchema>;
export function prepareOrder(value: unknown) {
  const input = orderSchema.parse(value);
  const seen = new Set<string>();
  const items = input.items.map((item) => {
    const artwork = artworks.find((a) => a.id === item.artworkId);
    if (!artwork)
      throw new Error(
        "Ein Motiv ist nicht mehr verfügbar. Bitte aktualisiere den Warenkorb.",
      );
    const key = `${item.artworkId}:${item.format}`;
    if (seen.has(key))
      throw new Error(
        "Ein Motiv und Format darf nur einmal in der Anfrage stehen.",
      );
    seen.add(key);
    return {
      ...item,
      title: artwork.title,
      unitPrice: printPrices[item.format],
    };
  });
  return {
    ...input,
    items,
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  };
}
export type PreparedOrder = ReturnType<typeof prepareOrder>;
