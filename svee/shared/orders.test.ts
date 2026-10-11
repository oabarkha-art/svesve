import { describe, expect, it } from "vitest";
import { artworks } from "../client/src/data/artworks";
import { prepareOrder } from "./orders";
export const sampleOrder = {
  requestId: "5fdf3cb4-73fd-4077-91ac-d1542bc858ee",
  customer: {
    name: "Test Person",
    email: "test@example.com",
    street: "Teststraße 1",
    postalCode: "12345",
    city: "Teststadt",
    country: "Deutschland",
    message: "",
  },
  items: [{ artworkId: artworks[0].id, format: "A4" as const, quantity: 2 }],
  acknowledged: true,
};
describe("order catalogue and validation", () => {
  it("ignores supplied prices and titles, computes authoritative cents", () => {
    const order = prepareOrder({
      ...sampleOrder,
      total: 1,
      items: [{ ...sampleOrder.items[0], unitPrice: 1, title: "Fake title" }],
    });
    expect(order.total).toBe(4800);
    expect(order.items[0].unitPrice).toBe(2400);
    expect(order.items[0].title).toBe(artworks[0].title);
  });
  it.each([0, -1, 21, 1.5, "2"])("rejects invalid quantity %s", (quantity) => {
    expect(() =>
      prepareOrder({
        ...sampleOrder,
        items: [{ ...sampleOrder.items[0], quantity }],
      }),
    ).toThrow();
  });
  it("rejects unknown artwork, format, duplicates and empty carts", () => {
    for (const items of [
      [],
      [{ ...sampleOrder.items[0], artworkId: "missing" }],
      [{ ...sampleOrder.items[0], format: "A2" }],
      [...sampleOrder.items, ...sampleOrder.items],
    ])
      expect(() => prepareOrder({ ...sampleOrder, items })).toThrow();
  });
  it("requires valid email, address, acknowledgement and empty honeypot", () => {
    for (const input of [
      {
        ...sampleOrder,
        customer: { ...sampleOrder.customer, email: "invalid" },
      },
      { ...sampleOrder, customer: { ...sampleOrder.customer, street: " " } },
      { ...sampleOrder, acknowledged: false },
      { ...sampleOrder, website: "spam" },
    ])
      expect(() => prepareOrder(input)).toThrow();
  });
});
