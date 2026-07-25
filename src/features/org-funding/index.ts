import { lazy } from "react";

export const OrgFundingPage = lazy(() => import("./pages/OrgFundingPage"));
export const AdminOrgFundingPage = lazy(
  () => import("./pages/AdminOrgFundingPage")
);
export const AdminOrgFundingDatesPage = lazy(
  () => import("./pages/AdminOrgFundingDatesPage")
);

export {
  createOrgFundingDate,
  deleteOrgFundingDate,
  downloadOrgFundingAttachment,
  getOrgFundingRequest,
  listAllOrgFundingDates,
  listOpenOrgFundingDates,
  listOrgFundingRequests,
  submitOrgFundingRequest,
  updateOrgFundingDate,
  updateOrgFundingRequest,
} from "./services/orgFundingService";
export { orgFundingKeys } from "./queryKeys";

export type {
  ListOrgFundingParams,
  OrgFundingChecklist,
  OrgFundingContact,
  OrgFundingDate,
  OrgFundingDatePayload,
  OrgFundingDocumentKey,
  OrgFundingRequestRow,
  OrgFundingStatus,
  SubmitOrgFundingPayload,
  SubmitOrgFundingResponse,
  UpdateOrgFundingPayload,
} from "./services/orgFundingService";
