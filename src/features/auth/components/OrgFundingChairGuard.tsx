import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@shared/components/LoadingFallback";
import { useAuthMe } from "../hooks/useAuthMe";

interface OrgFundingChairGuardProps {
  children: React.ReactNode;
}

const REQUIRED_ORG_FUNDING_CHAIR_ROLES = [
  "Technology Chair",
  "Treasurer",
  "Org Funding Chair",
];

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

/**
 * Requires an authenticated staff user with one of the configured EXPO exec roles.
 * Copy this guard and change REQUIRED_EXEC_ROLES for another role-restricted page.
 */
export function OrgFundingChairGuard({ children }: OrgFundingChairGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();
  const requiredRoles = REQUIRED_ORG_FUNDING_CHAIR_ROLES.map(normalizeRole);
  const userRoles = (meQuery.data?.exec_roles ?? []).map(normalizeRole);
  const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

  if (meQuery.isPending && !hasRequiredRole) {
    return <LoadingFallback />;
  }

  if (meQuery.isError || !hasRequiredRole) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}