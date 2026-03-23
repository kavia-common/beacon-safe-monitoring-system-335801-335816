import React, { useEffect, useMemo, useState } from "react";
import type { Device } from "../types";
import { useApp } from "../state/AppContext";

function statusStyles(status: Device["status"]) {
  switch (status) {
    case "online":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
    case "warning":
      return "border-amber-400/30 bg-amber-400/10 text-amber-200";
    case "offline":
    default:
      return "border-red-400/30 bg-red-400/10 text-red-200";
  }
}

function DeviceCard({ device }: { device: Device }) {
  const battery = Math.max(0, Math.min(100, Math.round(device.batteryLevel)));
  const barColor =
    battery >= 60 ? "bg-emerald-400" : battery >= 30 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">{device.name}</div>
          <div className="text-xs text-slate-400">{device.location}</div>
        </div>

        <span
          className={[
            "rounded-full border px-2 py-1 text-xs font-semibold capitalize",
            statusStyles(device.status)
          ].join(" ")}
        >
          {device.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Battery</span>
          <span className="font-semibold text-slate-200">{battery}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-900/70">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${battery}%` }} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Heartbeat</span>
          <span className="text-cyan-300">OK</span>
        </div>
        <div className="mt-1 text-slate-400">
          Integrity checks and telemetry stream status.
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { deviceList, refreshDevices, errorMessage } = useApp();
  const [loading, setLoading] = useState(false);

  const hasDevices = useMemo(() => deviceList.length > 0, [deviceList.length]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        await refreshDevices();
      } catch {
        // errorMessage is stored in context; UI will render it.
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshDevices]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Device Overview</h2>
          <p className="text-sm text-slate-400">
            Monitor IoT status, battery health, and integrity signals.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              await refreshDevices();
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/15"
        >
          Refresh
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-950/30 p-4">
        <div className="bg-cyber-grid rounded-xl border border-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">System Readiness</div>
            <div className="text-xs font-semibold text-cyan-300">
              {loading ? "Scanning..." : "Stable"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {loading && !hasDevices ? (
          <div className="col-span-full text-sm text-slate-400">
            Loading devices…
          </div>
        ) : null}

        {!loading && !hasDevices && !errorMessage ? (
          <div className="col-span-full text-sm text-slate-400">
            No devices found.
          </div>
        ) : null}

        {deviceList.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </section>
  );
}
