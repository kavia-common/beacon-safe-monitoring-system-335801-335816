import React from "react";
import { useApp } from "../../state/AppContext";

export function Topbar({ title }: { title: string }) {
  const { user } = useApp();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-base font-semibold text-slate-100">{title}</h1>
          <p className="text-xs text-slate-400">
            Secure telemetry • Real-time readiness
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-xs font-medium text-slate-200">
              {user?.name ?? user?.username ?? "Operator"}
            </div>
            <div className="text-xs text-slate-400">{user?.email ?? ""}</div>
          </div>
          <div className="h-9 w-9 rounded-xl border border-slate-700/70 bg-slate-900/50" />
        </div>
      </div>
    </header>
  );
}
