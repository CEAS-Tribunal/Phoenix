import { lazy } from "react";

export const AdminReimbursementsPage = lazy(
  () => import("./pages/AdminReimbursementsPage")
);
export const AdminReimbursementRequestsPage = lazy(
  () => import("./pages/AdminReimbursementRequestsPage")
);

export {
  downloadReimbursementAttachment,
  listReimbursementRequests,
  patchReimbursementFiled,
  submitReimbursementRequest,
} from "./services/reimbursementService";
export { reimbursementKeys } from "./queryKeys";

export type {
  ListReimbursementsParams,
  ReimbursementRequestRow,
  SubmitReimbursementPayload,
  SubmitReimbursementResponse,
} from "./services/reimbursementService";
