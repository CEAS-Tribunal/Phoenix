import axios, { type AxiosError } from "axios";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

/** In-memory JWT storage (not persisted; refresh clears on page reload). */
let accessToken: string | null = null;
/** After login / refreshMe; cleared after successful password change. */
let mustChangePassword = false;
/** Mirrors /dashboard/auth/me/ is_staff — SPA admin is staff-only. */
let isStaffUser = false;
/** Username from last /me response (for client-side password rules). */
let cachedUsername: string | null = null;

const api = axios.create({
  baseURL,
  withCredentials: false,
});

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface AuthMeResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  must_change_password: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_exec: boolean;
}

function setMustChangePassword(value: boolean): void {
  mustChangePassword = value;
}

export function getMustChangePassword(): boolean {
  return mustChangePassword;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function isAuthenticated(): boolean {
  return accessToken !== null;
}

export function logout(): void {
  accessToken = null;
  mustChangePassword = false;
  isStaffUser = false;
  cachedUsername = null;
}

export function getIsStaffUser(): boolean {
  return isStaffUser;
}

export function getCachedUsername(): string | null {
  return cachedUsername;
}

function authHeader(): { Authorization: string } | Record<string, never> {
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}

/**
 * Fetch current user; updates in-memory must-change-password flag.
 */
export async function refreshMe(): Promise<AuthMeResponse> {
  const { data } = await api.get<AuthMeResponse>("/dashboard/auth/me/", {
    headers: authHeader(),
  });
  cachedUsername = data.username;
  setMustChangePassword(!!data.must_change_password);
  isStaffUser = !!data.is_staff;
  return data;
}

/**
 * Obtain JWT and load /me. Tokens stored in memory only.
 */
export async function login(
  username: string,
  password: string
): Promise<{ mustChangePassword: boolean }> {
  const { data } = await api.post<TokenPair>("/api/token/", {
    username: username.trim(),
    password,
  });
  accessToken = data.access;

  const me = await refreshMe();
  return { mustChangePassword: !!me.must_change_password };
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.post("/dashboard/auth/change-password/", payload, {
    headers: authHeader(),
  });
  setMustChangePassword(false);
}

function formatErrorMessage(err: unknown): string {
  const ax = err as AxiosError<Record<string, unknown>>;
  if (!axios.isAxiosError(err)) {
    return "Something went wrong. Please try again.";
  }
  const d = ax.response?.data;
  if (typeof d === "string") return d;
  if (d && typeof d === "object") {
    const detail = d.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length) return String(detail[0]);
    const nonField = d.non_field_errors;
    if (Array.isArray(nonField) && nonField.length) return String(nonField[0]);
    const firstKey = Object.keys(d)[0];
    const val = firstKey ? (d as Record<string, unknown>)[firstKey] : undefined;
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === "string") return val;
  }
  if (ax.response?.status === 401) return "Invalid username or password.";
  if (ax.response?.status === 403) {
    const d403 = ax.response?.data;
    if (d403 && typeof d403 === "object" && typeof (d403 as { detail?: string }).detail === "string") {
      return (d403 as { detail: string }).detail;
    }
    return "Access denied. Staff accounts only.";
  }
  return "Request failed. Please try again.";
}

export { formatErrorMessage };
