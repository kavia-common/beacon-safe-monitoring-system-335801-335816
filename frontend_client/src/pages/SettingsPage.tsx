import React, { useEffect, useState } from "react";
import { useApp } from "../state/AppContext";

export function SettingsPage() {
  const { user, refreshProfile, theme, setTheme, errorMessage } = useApp();
  const [loading, setLoading] = useState(false);

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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">Profile</h3>
            <span className="text-xs text-slate-400">{loading ? "Loading…" : "OK"}</span>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/30 px-3 py-2">
              <span className="text-slate-400">Name</span>
              <span className="font-medium text-slate-200">
                {user?.name ?? user?.username ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/30 px-3 py-2">
              <span className="text-slate-400">Email</span>
              <span className="font-medium text-slate-200">
                {user?.email ?? "—"}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Profile values are loaded from <code>/me</code> when available.
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
                Dark cyber-security aesthetic recommended.
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
    </section>
  );
}
