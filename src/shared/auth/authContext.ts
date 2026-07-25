import { createContext, useContext } from "react";

/**
 * Auth contract exposed to shared UI (e.g. Navbar) via dependency inversion.
 * The concrete provider lives in the auth feature and is mounted at the app root.
 */
export interface AuthContextValue {
  isAuthenticated: boolean;
  /** Clears the session and query cache. Navigation is the caller's responsibility. */
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
