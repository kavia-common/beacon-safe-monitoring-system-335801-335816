import React from "react";
import { NavLink } from "react-router-dom";

function NavItem({
  to,
  label
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
          "border border-slate-800/70",
          isActive
            ? "bg-slate-900/70 text-cyan-300 shadow-glow"
            : "bg-slate-950/40 text-slate-200 hover:bg-slate-900/50 hover:text-cyan-200"
        ].join(" ")
      }
    >
      <span>{label}</span>
      <span className="text-xs text-slate-400">↗</span>
    </NavLink>
  );
}

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="hidden w-64 flex-col gap-4 border-r border-slate-800/70 bg-slate-950/70 p-4 sm:flex">
      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide text-cyan-300">
              BEACON-SAFE
            </div>
            <div className="text-xs text-slate-400">Monitoring Console</div>
          </div>
          <div className="h-9 w-9 rounded-xl border border-cyan-400/30 bg-cyan-400/10" />
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/settings" label="Settings" />
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/15"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
