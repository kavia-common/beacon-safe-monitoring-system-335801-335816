import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticating, errorMessage, theme, setTheme } = useApp();

  const [username, setUsername] = useState("operator");
  const [password, setPassword] = useState("password");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-950/50 p-6 shadow-glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold tracking-wide text-cyan-300">
                BEACON-SAFE
              </div>
              <h1 className="mt-2 text-xl font-semibold">Secure Login</h1>
              <p className="mt-1 text-sm text-slate-400">
                Authenticate to access your monitoring console.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900/60"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await login({ username, password });
                navigate("/dashboard", { replace: true });
              } catch {
                // error is already surfaced via context errorMessage
              }
            }}
          >
            <div>
              <label className="text-xs font-medium text-slate-300">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                placeholder="operator"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthenticating ? "Authenticating…" : "Login"}
            </button>

            <div className="text-xs text-slate-500">
              Demo mode: any credentials are accepted by the backend.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
