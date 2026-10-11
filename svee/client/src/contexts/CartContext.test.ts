import { expect, it } from "vitest";
import { restoreCart } from "./CartContext";
it("restores only valid current catalogue items and merges duplicates", () => {
  const item = { artworkId: "painting-seerose", format: "A4", quantity: 2 };
  expect(
    restoreCart([
      item,
      item,
      null,
      { ...item, quantity: -1 },
      { ...item, artworkId: "missing" },
      { ...item, format: "A2" },
    ]),
  ).toEqual([{ ...item, quantity: 4 }]);
  expect(restoreCart("invalid")).toEqual([]);
});
