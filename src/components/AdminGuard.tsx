import { Navigate, useLocation } from "react-router-dom";

const ADMIN_AUTH_KEY = "adminAuthenticated";

export function isAdminAuthenticated(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Protects admin routes: redirects to /admin/login if not authenticated.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
