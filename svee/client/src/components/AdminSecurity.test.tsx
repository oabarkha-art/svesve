// @vitest-environment jsdom
import React from "react";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AdminSecurity from "./AdminSecurity";
const mfa = vi.hoisted(() => ({
  listFactors: vi.fn(),
  getAuthenticatorAssuranceLevel: vi.fn(),
  enroll: vi.fn(),
  challengeAndVerify: vi.fn(),
  unenroll: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({ supabase: { auth: { mfa } } }));
beforeEach(() => {
  vi.stubGlobal("React", React);
  vi.clearAllMocks();
  mfa.listFactors.mockResolvedValue({ data: { totp: [] }, error: null });
  mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({
    data: { currentLevel: "aal1" },
    error: null,
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("offers enrollment without silently enabling MFA", async () => {
  render(<AdminSecurity token="session" />);
  expect(
    await screen.findByText("Zwei-Faktor-Anmeldung einrichten"),
  ).toBeTruthy();
  expect(mfa.enroll).not.toHaveBeenCalled();
});
it("requires a code for an already enrolled factor and handles rejected codes", async () => {
  mfa.listFactors.mockResolvedValue({
    data: { totp: [{ id: "factor-1", status: "verified" }] },
    error: null,
  });
  mfa.challengeAndVerify.mockResolvedValue({ error: new Error("bad code") });
  render(<AdminSecurity token="session" />);
  const input = await screen.findByLabelText("6-stelliger App-Code");
  fireEvent.change(input, { target: { value: "123456" } });
  fireEvent.submit(input.closest("form")!);
  expect(await screen.findByText(/Code ungültig/)).toBeTruthy();
  expect(mfa.challengeAndVerify).toHaveBeenCalledWith({
    factorId: "factor-1",
    code: "123456",
  });
  expect(screen.queryByText(/Aktiv – diese Sitzung/)).toBeNull();
});
