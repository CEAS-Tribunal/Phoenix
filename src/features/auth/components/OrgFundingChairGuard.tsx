import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@shared/components/LoadingFallback";
import { useAuthMe } from "../hooks/useAuthMe";
import { getIsOrgFundingChairUser } from "../services/authService";

interface OrgFundingChairGuardProps {
  children: React.ReactNode;
}

/**
 * Requires staff auth (use inside AdminGuard). Allows only users with the Org Funding
 * chair exec role or a superuser — mirrors `/dashboard/auth/me/` `is_org_funding_chair`.
 */
export function OrgFundingChairGuard({ children }: OrgFundingChairGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();

  const allowChair =
    (meQuery.data?.is_org_funding_chair ?? getIsOrgFundingChairUser()) === true;

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
