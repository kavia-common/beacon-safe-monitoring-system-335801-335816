export type ThemeMode = "dark" | "light";

export type DeviceStatus = "online" | "offline" | "warning";

export interface User {
  username: string;
  name?: string;
  email?: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  batteryLevel: number; // 0..100
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Preferences {
  theme: ThemeMode;
}

export interface ProfileResponse {
  user: User;
  preferences: Preferences;
}

export interface UpdateSettingsRequest {
  name?: string | null;
  email?: string | null;
  theme?: ThemeMode | null;
}
