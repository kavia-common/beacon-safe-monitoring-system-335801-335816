import React, { useEffect, useState } from "react";
import { useApp } from "../state/AppContext";

export function SettingsPage() {
  const { user, refreshProfile, updateSettings, theme, setTheme, errorMessage } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        await refreshProfile();
      } catch {
        // surfaced via errorMessage
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshProfile]);

  useEffect(() => {
    // Initialize form fields from the latest user object.
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.username, user?.name, user?.email]);

  function normalizeText(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-400">
          Manage profile details and console preferences.
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {saveMessage ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {saveMessage}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Profile</h3>
            <span className="text-xs text-slate-400">{loading ? "Loading…" : "OK"}</span>
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div className="text-xs text-slate-500">
              Username: <span className="text-slate-300">{user?.username ?? "—"}</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                placeholder="name@company.com"
                type="email"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
          <h3 className="text-sm font-semibold text-slate-100">Preferences</h3>
          <p className="mt-1 text-sm text-slate-400">
            Choose how the console looks and feels.
          </p>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/30 p-4">
            <div>
              <div className="text-sm font-medium text-slate-200">Theme</div>
              <div className="text-xs text-slate-500">
                Saved to your profile via <code>/settings</code>.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold transition",
                  theme === "dark"
                    ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                    : "border border-slate-800/70 bg-slate-950/30 text-slate-200 hover:bg-slate-900/60"
                ].join(" ")}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold transition",
                  theme === "light"
                    ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                    : "border border-slate-800/70 bg-slate-950/30 text-slate-200 hover:bg-slate-900/60"
                ].join(" ")}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setSaveMessage(null);
            try {
              await updateSettings({
                name: normalizeText(name),
                email: normalizeText(email),
                theme
              });
              setSaveMessage("Settings saved.");
            } catch {
              // surfaced via errorMessage
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </section>
  );
}
