// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../contexts/CartContext";
import Prints from "./Prints";
import Checkout from "./Checkout";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/prints");
  vi.stubGlobal("React", React);
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const show = (page: React.ReactNode) =>
  render(<CartProvider>{page}</CartProvider>);
function fillForm() {
  for (const [label, value] of [
    ["Name", "Test Person"],
    ["E-Mail", "test@example.com"],
    ["Straße und Hausnummer", "Teststraße 1"],
    ["Postleitzahl", "12345"],
    ["Ort", "Teststadt"],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("checkbox"));
}
describe("shop interaction", () => {
  it("filters all 25 artworks by painting and illustration", async () => {
    const user = userEvent.setup();
    show(<Prints />);
    expect(screen.getAllByText(/In den Warenkorb/)).toHaveLength(25);
    await user.click(screen.getByRole("button", { name: "Malerei" }));
    expect(screen.getAllByText(/In den Warenkorb/)).toHaveLength(13);
    await user.click(screen.getByRole("button", { name: "Illustration" }));
    expect(screen.getAllByText(/In den Warenkorb/)).toHaveLength(12);
  });
  it("adds selected formats and keeps quantities in browser storage", async () => {
    const user = userEvent.setup();
    show(<Prints />);
    await user.selectOptions(screen.getAllByRole("combobox")[0], "A3");
    await user.click(
      screen.getAllByRole("button", { name: /In den Warenkorb/ })[0],
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Ein Print mehr: Grüner Schnee" }),
    );
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem("svea-print-cart-v1")!)).toEqual([
        { artworkId: "painting-seerose", format: "A3", quantity: 2 },
      ]),
    );
    expect(screen.getByText("104,00 €", { selector: "strong" })).toBeTruthy();
    await user.click(
      screen.getByRole("button", {
        name: "Grüner Schnee aus dem Warenkorb entfernen",
      }),
    );
    expect(screen.getByText("Dein Warenkorb ist noch leer.")).toBeTruthy();
  });
  it("preserves the cart on server error, confirms and clears only after success", async () => {
    localStorage.setItem(
      "svea-print-cart-v1",
      JSON.stringify([
        { artworkId: "painting-seerose", format: "A4", quantity: 2 },
      ]),
    );
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Speichern fehlgeschlagen" }), {
          status: 503,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ orderId: "test-receipt", total: 4800 }), {
          status: 201,
        }),
      );
    vi.stubGlobal("fetch", fetch);
    show(<Checkout />);
    fillForm();
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Unverbindliche Anfrage senden" })
        .closest("form")!,
    );
    await screen.findByRole("alert");
    expect(screen.queryByText("Danke für deine Anfrage!")).toBeNull();
    expect(
      JSON.parse(localStorage.getItem("svea-print-cart-v1")!),
    ).toHaveLength(1);
    const id = JSON.parse(fetch.mock.calls[0][1].body).requestId;
    fireEvent.submit(
      screen
        .getByRole("button", { name: "Unverbindliche Anfrage senden" })
        .closest("form")!,
    );
    await screen.findByText("Danke für deine Anfrage!");
    expect(JSON.parse(localStorage.getItem("svea-print-cart-v1")!)).toEqual([]);
    expect(JSON.parse(fetch.mock.calls[1][1].body).requestId).toBe(id);
  });
});
