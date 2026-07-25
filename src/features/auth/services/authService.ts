import type { AxiosInstance } from "axios";
import type { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

const STORAGE_ACCESS = "tribunal_staff_access_jwt";
const STORAGE_REFRESH = "tribunal_staff_refresh_jwt";

/** Current access JWT (mirrors localStorage when persisted). */
let accessToken: string | null = null;
/** Refresh JWT for `/api/token/refresh/`; kept in memory + localStorage. */
let refreshToken: string | null = null;
/** After login / refreshMe; cleared after successful password change. */
let mustChangePassword = false;
/** Mirrors /dashboard/auth/me/ is_staff — SPA admin is staff-only. */
let isStaffUser = false;
/** Mirrors /dashboard/auth/me/ is_treasurer — can update reimbursement filing status. */
let isTreasurerUser = false;
/** Mirrors /dashboard/auth/me/ is_org_funding_chair — can manage org funding submissions/dates. */
let isOrgFundingChairUser = false;
/** Username from last /me response (for client-side password rules). */
let cachedUsername: string | null = null;

const api = axios.create({
  baseURL,
  withCredentials: false,
});

/** Plain client for refresh only (no auth interceptors). */
const refreshHttp = axios.create({
  baseURL,
  withCredentials: false,
});

function readTokensFromStorage(): void {
  try {
    const a = localStorage.getItem(STORAGE_ACCESS);
    const r = localStorage.getItem(STORAGE_REFRESH);
    if (!a) {
      accessToken = null;
      refreshToken = null;
      if (r) localStorage.removeItem(STORAGE_REFRESH);
      return;
    }
    accessToken = a;
    refreshToken = r;
  } catch {
    accessToken = null;
    refreshToken = null;
  }
}

function persistTokensToStorage(access: string, refresh: string): void {
  try {
    localStorage.setItem(STORAGE_ACCESS, access);
    if (refresh) {
      localStorage.setItem(STORAGE_REFRESH, refresh);
    } else {
      localStorage.removeItem(STORAGE_REFRESH);
    }
  } catch {
    /* private mode / quota */
  }
  accessToken = access;
  refreshToken = refresh || null;
}

function clearStoredTokens(): void {
  try {
    localStorage.removeItem(STORAGE_ACCESS);
    localStorage.removeItem(STORAGE_REFRESH);
  } catch {
    /* ignore */
  }
  accessToken = null;
  refreshToken = null;
}

readTokensFromStorage();

/** Root segment for TanStack Query keys; use with `getAuthMeQueryKey()`. */
export const AUTH_ME_QUERY_ROOT = "auth-me" as const;

export function logout(): void {
  clearStoredTokens();
  mustChangePassword = false;
  isStaffUser = false;
  isTreasurerUser = false;
  isOrgFundingChairUser = false;
  cachedUsername = null;
}

export function logoutWithQueryClient(queryClient: QueryClient): void {
  logout();
  void queryClient.removeQueries({ queryKey: [AUTH_ME_QUERY_ROOT] });
}

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
  is_treasurer: boolean;
  /**
   * True when the account holds the Org Funding chair exec role (or is a superuser).
   * Backend should expose this on `/dashboard/auth/me/`; defaults to false when absent.
   */
  is_org_funding_chair: boolean;
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

export function getIsStaffUser(): boolean {
  return isStaffUser;
}

export function getIsTreasurerUser(): boolean {
  return isTreasurerUser;
}

export function getIsOrgFundingChairUser(): boolean {
  return isOrgFundingChairUser;
}

export function getCachedUsername(): string | null {
  return cachedUsername;
}

export function getAuthMeQueryKey(): readonly [typeof AUTH_ME_QUERY_ROOT, string] {
  return [AUTH_ME_QUERY_ROOT, getAccessToken() ?? ""];
}

function authHeader(): { Authorization: string } | Record<string, never> {
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}

export async function refreshMe(): Promise<AuthMeResponse> {
  const { data } = await api.get<AuthMeResponse>("/dashboard/auth/me/", {
    headers: authHeader(),
  });
  cachedUsername = data.username;
  setMustChangePassword(!!data.must_change_password);
  isStaffUser = !!data.is_staff;
  isTreasurerUser = !!data.is_treasurer;
  isOrgFundingChairUser = !!data.is_org_funding_chair;
  return data;
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessTokenWithServer(): Promise<boolean> {
  if (!refreshToken) return false;
  if (!refreshInFlight) {
    refreshInFlight = (async (): Promise<boolean> => {
      try {
        const { data } = await refreshHttp.post<{ access: string }>("/api/token/refresh/", {
          refresh: refreshToken,
        });
        accessToken = data.access;
        try {
          localStorage.setItem(STORAGE_ACCESS, data.access);
        } catch {
          /* ignore */
        }
        return true;
      } catch {
        logout();
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

const wiredRefreshClients = new WeakSet<AxiosInstance>();

export function registerAdminApiAuthRefresh(client: AxiosInstance): void {
  if (wiredRefreshClients.has(client)) return;
  wiredRefreshClients.add(client);

  client.interceptors.response.use(
    (res) => res,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) {
        return Promise.reject(error);
      }
      const status = error.response?.status;
      const url = String(error.config.url ?? "");
      if (status !== 401) return Promise.reject(error);
      if (url.includes("/api/token/")) return Promise.reject(error);

      const cfg = error.config as typeof error.config & { _retryAfterRefresh?: boolean };
      if (cfg._retryAfterRefresh) return Promise.reject(error);

      const ok = await refreshAccessTokenWithServer();
      if (!ok) return Promise.reject(error);

      cfg._retryAfterRefresh = true;
      cfg.headers = cfg.headers ?? {};
      (cfg.headers as Record<string, string>).Authorization = `Bearer ${accessToken ?? ""}`;
      return client.request(cfg);
    }
  );
}

registerAdminApiAuthRefresh(api);

function shouldClearSessionOnRestoreError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const s = err.response?.status;
  return s === 401 || s === 403;
}

/**
 * After reload: validate stored JWT with `/dashboard/auth/me/`, fill staff flags, and optionally
 * seed React Query so the admin dashboard (including treasurer tile) has data on first paint.
 */
export async function restoreAuthSession(queryClient?: QueryClient): Promise<void> {
  readTokensFromStorage();
  if (!accessToken) return;

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
    try {
      const me = await refreshMe();
      if (queryClient) {
        queryClient.setQueryData(getAuthMeQueryKey(), me);
      }
      return;
    } catch (e) {
      if (shouldClearSessionOnRestoreError(e)) {
        logout();
        if (queryClient) {
          void queryClient.removeQueries({ queryKey: [AUTH_ME_QUERY_ROOT] });
        }
        return;
      }
    }
  }

  // Still have a staff-issued access token but /me failed (e.g. transient network). Avoid wiping
  // localStorage so reload can succeed later; AdminGuard treats staff JWT as staff until /me runs.
  if (accessToken) {
    isStaffUser = true;
  }
}

export async function login(
  username: string,
  password: string
): Promise<{ mustChangePassword: boolean; me: AuthMeResponse }> {
  const { data } = await api.post<TokenPair>("/api/token/", {
    username: username.trim(),
    password,
  });
  if (!data.refresh) {
    console.warn("AuthService: token response missing refresh; session may not renew after access expiry.");
  }
  persistTokensToStorage(data.access, data.refresh ?? "");

  const me = await refreshMe();
  return { mustChangePassword: !!me.must_change_password, me };
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
