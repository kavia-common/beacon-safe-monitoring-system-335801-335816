import { createApiClient } from "./client";
import type { Device, LoginResponse, ProfileResponse, UpdateSettingsRequest } from "../types";

export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * PUBLIC_INTERFACE
 * Backend API adapter.
 *
 * Contract:
 * - Callers provide baseUrl and token via params.
 * - Each method returns typed responses matching the Beacon-Safe backend contract.
 */
export function beaconSafeApi(params: { token?: string | null; baseUrl?: string }) {
  const client = createApiClient({ token: params.token ?? null, baseUrl: params.baseUrl });

  return {
    // PUBLIC_INTERFACE
    async login(body: LoginRequest): Promise<LoginResponse> {
      return client.request<LoginResponse>({
        method: "POST",
        path: "/auth/login",
        operation: "auth.login",
        body
      });
    },

    // PUBLIC_INTERFACE
    async getDevices(): Promise<Device[]> {
      return client.request<Device[]>({
        method: "GET",
        path: "/devices",
        operation: "devices.list"
      });
    },

    // PUBLIC_INTERFACE
    async getMe(): Promise<ProfileResponse> {
      return client.request<ProfileResponse>({
        method: "GET",
        path: "/me",
        operation: "me.get"
      });
    },

    // PUBLIC_INTERFACE
    async updateSettings(body: UpdateSettingsRequest): Promise<ProfileResponse> {
      return client.request<ProfileResponse>({
        method: "PATCH",
        path: "/settings",
        operation: "settings.update",
        body
      });
    }
  };
}
