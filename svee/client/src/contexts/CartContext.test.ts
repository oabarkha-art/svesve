import { expect, it } from "vitest";
import { restoreCart } from "./CartContext";
it("restores valid item references, including newly added works, and merges duplicates", () => {
  const item = { artworkId: "painting-seerose", format: "A4", quantity: 2 };
  expect(
    restoreCart([
      item,
      item,
      null,
      { ...item, quantity: -1 },
      { ...item, artworkId: "" },
      { ...item, format: "A2" },
    ]),
  ).toEqual([{ ...item, quantity: 4 }]);
  expect(restoreCart("invalid")).toEqual([]);
});

it("preserves new database artwork IDs across reloads",()=>{expect(restoreCart([{artworkId:"new-database-work",format:"A4",quantity:1}])).toHaveLength(1)});
