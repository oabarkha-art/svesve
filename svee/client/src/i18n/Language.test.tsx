// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  vi.stubGlobal("React", React);
  localStorage.clear();
  window.matchMedia = vi
    .fn()
    .mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("language selection", () => {
  it("switches checkout labels without losing customer input or cart contents", () => {
    window.history.replaceState(null, "", "/kasse");
    localStorage.setItem(
      "svea-print-cart-v1",
      JSON.stringify([
        { artworkId: "painting-seerose", format: "A4", quantity: 2 },
      ]),
    );
    render(<App />);
    expect(document.documentElement.lang).toBe("en");
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Alex" },
    });
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { name: "Order enquiry" })).toBeTruthy();
    expect(screen.getByLabelText("Street address")).toBeTruthy();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(
      "Alex",
    );
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem("svea-language")).toBe("en");
    expect(
      JSON.parse(localStorage.getItem("svea-print-cart-v1")!)[0].quantity,
    ).toBe(2);
    fireEvent.click(screen.getByRole("button", { name: "Deutsch" }));
    expect(
      screen.getByRole("heading", { name: "Bestellanfrage" }),
    ).toBeTruthy();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(
      "Alex",
    );
  });
  it("restores English for book descriptions and all eight preview links", () => {
    window.history.replaceState(null, "", "/illustration");
    localStorage.setItem("svea-language", "en");
    render(<App />);
    expect(
      screen.getByText("2026 · Digital illustration · 22 pages"),
    ).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: /enlarge preview/ }),
    ).toHaveLength(8);
    expect(screen.getByRole("link", { name: "Paintings" })).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: "Ich wünschte, ich hätte eine Schwester",
      }),
    ).toBeTruthy();
  });
});
