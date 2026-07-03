import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@/components/LoadingFallback";
import { useAuthMe } from "@/hooks/useAuthMe";
import { getIsTreasurerUser } from "@/services/AuthService";

interface TreasurerGuardProps {
  children: React.ReactNode;
}

/**
 * Requires staff auth (use inside AdminGuard). Allows only users with Treasurer exec role
 * or superuser — mirrors `/dashboard/auth/me/` `is_treasurer`.
 */
export function TreasurerGuard({ children }: TreasurerGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();

  const allowTreasurer =
    (meQuery.data?.is_treasurer ?? getIsTreasurerUser()) === true;

  if (meQuery.isPending && !allowTreasurer) {
    return <LoadingFallback />;
  }

  if (meQuery.isError) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  if (!allowTreasurer) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
