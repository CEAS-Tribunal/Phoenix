import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@shared/components/LoadingFallback";
import { useAuthMe } from "../hooks/useAuthMe";
import { getIsInnovationChallengeUser } from "../services/authService";

interface InnovationChallengeGuardProps {
  children: React.ReactNode;
}

export function InnovationChallengeGuard({
  children,
}: InnovationChallengeGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();
  const hasAccess = getIsInnovationChallengeUser();

  if (meQuery.isPending && !hasAccess) {
    return <LoadingFallback />;
  }

  if (meQuery.isError || !hasAccess) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
