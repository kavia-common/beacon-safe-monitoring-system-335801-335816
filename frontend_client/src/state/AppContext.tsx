import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Device, ThemeMode, User } from "../types";
import { beaconSafeApi } from "../api/endpoints";
import { ApiError } from "../api/client";
import { loadTheme, loadToken, loadUser, saveTheme, saveToken, saveUser } from "../utils/storage";

interface AppState {
  user: User | null;
  token: string | null;
  deviceList: Device[];
  theme: ThemeMode;

  isAuthenticating: boolean;
  errorMessage: string | null;

  // PUBLIC_INTERFACE
  login: (params: { username: string; password: string }) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => void;
  // PUBLIC_INTERFACE
  refreshDevices: () => Promise<void>;
  // PUBLIC_INTERFACE
  refreshProfile: () => Promise<void>;
  // PUBLIC_INTERFACE
  setTheme: (theme: ThemeMode) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// PUBLIC_INTERFACE
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadToken());
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [theme, setThemeState] = useState<ThemeMode>(() => loadTheme() ?? "dark");

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apply theme to <html> for Tailwind `dark:` classes.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    saveTheme(theme);
  }, [theme]);

  const api = useMemo(() => beaconSafeApi({ token }), [token]);

  async function login(params: { username: string; password: string }) {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const res = await api.login(params);
      setToken(res.token);
      setUser(res.user);

      saveToken(res.token);
      saveUser(res.user);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `${err.message}${err.details ? `: ${JSON.stringify(err.details)}` : ""}`
          : "Login failed";
      setErrorMessage(msg);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setDeviceList([]);
    setErrorMessage(null);

    saveToken(null);
    saveUser(null);
  }

  async function refreshDevices() {
    setErrorMessage(null);
    try {
      const devices = await api.getDevices();
      setDeviceList(devices);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `${err.message}${err.details ? `: ${JSON.stringify(err.details)}` : ""}`
          : "Failed to load devices";
      setErrorMessage(msg);
      throw err;
    }
  }

  async function refreshProfile() {
    setErrorMessage(null);
    try {
      const profile = await api.getMe();
      setUser(profile.user);
      saveUser(profile.user);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `${err.message}${err.details ? `: ${JSON.stringify(err.details)}` : ""}`
          : "Failed to load profile";
      setErrorMessage(msg);
      throw err;
    }
  }

  function setTheme(nextTheme: ThemeMode) {
    setThemeState(nextTheme);
  }

  const value: AppState = {
    user,
    token,
    deviceList,
    theme,
    isAuthenticating,
    errorMessage,
    login,
    logout,
    refreshDevices,
    refreshProfile,
    setTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
