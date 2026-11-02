import { lazy } from "react";

export const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
export const AdminChangePasswordPage = lazy(
  () => import("./pages/AdminChangePasswordPage")
);

export { AdminGuard } from "./components/AdminGuard";
export { TreasurerGuard } from "./components/TreasurerGuard";
export { OrgFundingChairGuard } from "./components/OrgFundingChairGuard";
export { AuthProvider } from "./components/AuthProvider";
export { useAuthMe } from "./hooks/useAuthMe";

export {
  AUTH_ME_QUERY_ROOT,
  changePassword,
  getAccessToken,
  getAuthMeQueryKey,
  getCachedUsername,
  getIsOrgFundingChairUser,
  getIsStaffUser,
  getIsTreasurerUser,
  getMustChangePassword,
  isAuthenticated,
  login,
  logout,
  logoutWithQueryClient,
  refreshMe,
  registerAdminApiAuthRefresh,
  restoreAuthSession,
} from "./services/authService";

export type {
  AuthMeResponse,
  ChangePasswordPayload,
  TokenPair,
} from "./services/authService";
