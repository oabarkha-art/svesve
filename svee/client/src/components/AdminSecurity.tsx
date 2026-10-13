import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
export default function AdminSecurity({ token }: { token: string }) {
  const { language } = useLanguage();
  const l = (de: string, en: string) => (language === "en" ? en : de);
  const [factors, setFactors] = useState<
    { id: string; friendly_name?: string }[]
  >([]);
  const [current, setCurrent] = useState("");
  const [level, setLevel] = useState("");
  const [enrollment, setEnrollment] = useState<{
    id: string;
    qr: string;
    secret: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  async function load() {
    const [f, a] = await Promise.all([
      supabase!.auth.mfa.listFactors(),
      supabase!.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    if (f.error || a.error)
      throw new Error(
        l(
          "Sicherheitseinstellungen konnten nicht geladen werden.",
          "Could not load security settings.",
        ),
      );
    const verified = f.data.totp.filter((x) => x.status === "verified");
    setFactors(verified);
    setCurrent(verified[0]?.id || "");
    setLevel(a.data.currentLevel || "aal1");
    setLoaded(true);
  }
  useEffect(() => {
    void load().catch((e) => setMessage(e.message));
  }, [token]);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : l(
              "Aktion fehlgeschlagen. Bitte erneut versuchen.",
              "Action failed. Please try again.",
            ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function enroll() {
    await run(async () => {
      const { data, error } = await supabase!.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Portfolio Authenticator",
      });
      if (error) throw error;
      setEnrollment({
        id: data.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setCode("");
    });
  }
  async function verify(e: FormEvent) {
    e.preventDefault();
    await run(async () => {
      const { error } = await supabase!.auth.mfa.challengeAndVerify({
        factorId: enrollment?.id || current,
        code,
      });
      setCode("");
      if (error)
        throw new Error(
          l(
            "Code ungültig oder abgelaufen. Bitte den aktuellen Code eingeben.",
            "Invalid or expired code. Enter the current code.",
          ),
        );
      setEnrollment(null);
      await load();
      setMessage(
        l(
          "Zwei-Faktor-Prüfung erfolgreich.",
          "Two-factor verification successful.",
        ),
      );
    });
  }
  const needsCode = !!enrollment || (factors.length > 0 && level !== "aal2");
  return (
    <section className="border p-5 mb-8 max-w-2xl">
      <h2 className="text-xl mb-3">
        {l(
          "Sicherheit: Zwei-Faktor-Anmeldung",
          "Security: two-factor authentication",
        )}
      </h2>
      {message && (
        <p role="status" className="my-3">
          {message}
        </p>
      )}
      {!loaded ? (
        <button
          className="filter-button"
          onClick={() => void run(load)}
          disabled={busy}
        >
          {l("Status laden", "Load status")}
        </button>
      ) : (
        <>
          {!factors.length && !enrollment && (
            <>
              <p className="mb-4">
                {l(
                  "Schütze deinen Zugang zusätzlich mit einer Authenticator-App. Nach der Aktivierung ist der App-Code für Verwaltungszugriffe erforderlich.",
                  "Protect your account with an authenticator app. Once enabled, its code is required for administrator access.",
                )}
              </p>
              <button
                className="shop-button"
                disabled={busy}
                onClick={() => void enroll()}
              >
                {l(
                  "Zwei-Faktor-Anmeldung einrichten",
                  "Set up two-factor authentication",
                )}
              </button>
            </>
          )}
          {enrollment && (
            <>
              <p>
                {l(
                  "Scanne den QR-Code mit deiner Authenticator-App. Bewahre den Einrichtungsschlüssel sicher auf.",
                  "Scan the QR code with your authenticator app. Keep the setup key in a safe place.",
                )}
              </p>
              <img
                src={
                  enrollment.qr.startsWith("data:")
                    ? enrollment.qr
                    : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(enrollment.qr)}`
                }
                alt={l("Authenticator-Einrichtung", "Authenticator setup")}
                className="w-56 h-56 my-4"
              />
              <details>
                <summary>
                  {l("Schlüssel manuell eingeben", "Enter key manually")}
                </summary>
                <code className="break-all">{enrollment.secret}</code>
              </details>
            </>
          )}
          {needsCode && (
            <form onSubmit={verify} className="space-y-4 my-4">
              {!enrollment && factors.length > 1 && (
                <label>
                  {l("Authenticator", "Authenticator")}
                  <select
                    className="shop-input"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                  >
                    {factors.map((f) => (
                      <option value={f.id} key={f.id}>
                        {f.friendly_name || "Authenticator"}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block">
                {l("6-stelliger App-Code", "6-digit app code")}
                <input
                  className="shop-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </label>
              <button className="shop-button" disabled={busy}>
                {l("Code bestätigen", "Verify code")}
              </button>
              {enrollment && (
                <button
                  className="filter-button ml-3"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      const { error } = await supabase!.auth.mfa.unenroll({
                        factorId: enrollment.id,
                      });
                      if (error) throw error;
                      setEnrollment(null);
                      setCode("");
                    })
                  }
                >
                  {l("Abbrechen", "Cancel")}
                </button>
              )}
            </form>
          )}
          {factors.length > 0 && level === "aal2" && !enrollment && (
            <p>
              {l(
                "Aktiv – diese Sitzung ist mit zwei Faktoren bestätigt.",
                "Enabled – this session is verified with two factors.",
              )}
            </p>
          )}
          <p className="text-sm mt-3 text-muted-foreground">
            {l(
              "Bei Verlust des Geräts kannst du den Faktor über dein Supabase-Konto unter Authentication → Users zurücksetzen.",
              "If you lose your device, reset the factor in your Supabase account under Authentication → Users.",
            )}
          </p>
        </>
      )}
    </section>
  );
}
