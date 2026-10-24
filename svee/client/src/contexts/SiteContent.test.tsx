// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SiteContentProvider, safeImage, safeLink } from "./SiteContentContext";
import { LanguageProvider, useLanguage, translate } from "./LanguageContext";
import Home from "../pages/Home";
import Books from "../components/Books";
const state = vi.hoisted(() => ({
  fields: [
    {
      key: "Hey, ich bin Svea",
      section: "Home",
      kind: "text",
      de: "Mein neuer Startseitentext",
      en: "My edited home text",
    },
    {
      key: "home.banner",
      section: "Home",
      kind: "image",
      de: "https://example.com/new-banner.webp",
      en: "",
    },
  ],
  books: [
    {
      id: "book-1",
      title_de: "Neues Buch",
      title_en: "New book",
      meta_de: "2027",
      meta_en: "2027",
      description_de: "Neue Beschreibung",
      description_en: "New description",
      cover: "/images/books/schwester-cover.webp",
      teasers: ["/images/books/schwester-1.webp"],
      published: true,
      sort_order: 0,
    },
  ],
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => ({
      select: () =>
        table === "site_content"
          ? Promise.resolve({ data: state.fields, error: null })
          : {
              eq: () => ({
                order: () =>
                  Promise.resolve({ data: state.books, error: null }),
              }),
            },
    }),
  },
}));
vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
beforeEach(() => {
  localStorage.setItem("svea-language", "de");
  vi.stubGlobal("React", React);
});
afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
  localStorage.clear();
});
function Switch() {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("en")}>English</button>;
}
describe("database website content", () => {
  it("shows saved home text and banner and switches to saved English", async () => {
    render(
      <SiteContentProvider>
        <LanguageProvider>
          <Switch />
          <Home />
        </LanguageProvider>
      </SiteContentProvider>,
    );
    expect(await screen.findByText("Mein neuer Startseitentext")).toBeTruthy();
    expect(document.querySelector("img")?.src).toBe(
      "https://example.com/new-banner.webp",
    );
    fireEvent.click(screen.getByText("English"));
    expect(await screen.findByText("My edited home text")).toBeTruthy();
  });
  it("renders saved books and their actual preview images", async () => {
    render(
      <SiteContentProvider>
        <LanguageProvider>
          <Books />
        </LanguageProvider>
      </SiteContentProvider>,
    );
    expect(await screen.findByText("Neues Buch")).toBeTruthy();
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.queryByText("Secret little laws")).toBeNull();
  });
  it("supports intentionally empty text and preserves placeholder substitution", () => {
    expect(
      translate(
        "de",
        "Hello {title}",
        { title: "Svea" },
        { "Hello {title}": { de: "Willkommen {title}", en: "" } },
      ),
    ).toBe("Willkommen Svea");
    expect(
      translate(
        "en",
        "Hello {title}",
        { title: "Svea" },
        { "Hello {title}": { de: "", en: "" } },
      ),
    ).toBe("");
  });
  it("rejects executable image and link URLs", () => {
    expect(safeImage("javascript:alert(1)")).toBe("");
    expect(safeLink("javascript:alert(1)")).toBe("#");
    expect(safeImage("/images/home-banner.webp")).toBe(
      "/images/home-banner.webp",
    );
  });
});
