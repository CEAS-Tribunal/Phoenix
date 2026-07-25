import { useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AuthContext, type AuthContextValue } from "@shared/auth/authContext";
import { isAuthenticated, logoutWithQueryClient } from "../services/authService";
import { useAuthMe } from "../hooks/useAuthMe";

/**
 * Concrete auth provider backing the shared AuthContext. Mounted at the app root
 * so shared UI (e.g. Navbar) can read auth state without importing the auth feature.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const meQuery = useAuthMe({ enabled: isAuthenticated() });

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(meQuery.data) || isAuthenticated(),
      logout: () => logoutWithQueryClient(queryClient),
    }),
    [meQuery.data, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
