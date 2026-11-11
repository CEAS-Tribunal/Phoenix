import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@shared/components/LoadingFallback";
import { useAuthMe } from "../hooks/useAuthMe";
import { getIsEsocChairUser } from "../services/authService";

interface EsocChairGuardProps {
  children: React.ReactNode;
}

/**
 * Requires staff auth (use inside AdminGuard). Allows only users with the ESOC
 * exec role or a superuser — mirrors `/dashboard/auth/me/` `is_esoc_chair`.
 */
export function EsocChairGuard({ children }: EsocChairGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();

  const allowChair =
    (meQuery.data?.is_esoc_chair ?? getIsEsocChairUser()) === true;

  if (meQuery.isPending && !allowChair) {
    return <LoadingFallback />;
  }

  if (meQuery.isError) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  if (!allowChair) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
