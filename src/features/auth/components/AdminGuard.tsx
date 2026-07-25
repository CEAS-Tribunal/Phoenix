import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";

import {
  getIsStaffUser,
  getMustChangePassword,
  isAuthenticated,
  logoutWithQueryClient,
} from "../services/authService";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Protects admin routes: redirects to /admin/login if not authenticated.
 * If the user must change their password, redirects to /admin/change-password.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation();
  const queryClient = useQueryClient();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!getIsStaffUser()) {
    logoutWithQueryClient(queryClient);
    return <Navigate to="/" replace />;
  }

  if (getMustChangePassword() && location.pathname !== "/admin/change-password") {
    return <Navigate to="/admin/change-password" replace />;
  }

  return <>{children}</>;
}
