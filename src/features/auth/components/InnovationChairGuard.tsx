import { Navigate, useLocation } from "react-router-dom";

import LoadingFallback from "@shared/components/LoadingFallback";
import { useAuthMe } from "../hooks/useAuthMe";
import { getIsInnovationChairUser } from "../services/authService";

interface InnovationChairGuardProps {
  children: React.ReactNode;
}

export function InnovationChairGuard({
  children,
}: InnovationChairGuardProps) {
  const location = useLocation();
  const meQuery = useAuthMe();
  const hasAccess = getIsInnovationChairUser();

  if (meQuery.isPending && !hasAccess) {
    return <LoadingFallback />;
  }

  if (meQuery.isError || !hasAccess) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
