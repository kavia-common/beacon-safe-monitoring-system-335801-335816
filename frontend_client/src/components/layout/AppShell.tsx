import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useApp } from "../../state/AppContext";

function titleFromPath(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Beacon-Safe";
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar
          onLogout={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={titleFromPath(location.pathname)} />
          <main className="flex-1 p-4 sm:p-6">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.4)] sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
