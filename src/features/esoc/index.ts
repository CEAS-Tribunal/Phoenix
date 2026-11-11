import { lazy } from "react";

export const EsocPage = lazy(() => import("./pages/EsocPage"));
export const AdminEsocPage = lazy(
  () => import("./pages/AdminEsocPage")
);
export const AdminEsocDatesPage = lazy(
  () => import("./pages/AdminEsocDatesPage")
);

export {
  createEsocDate,
  deleteEsocDate,
  downloadEsocAttachment,
  getEsocRequest,
  listAllEsocDates,
  listOpenEsocDates,
  listEsocRequests,
  submitEsocRequest,
  updateEsocDate,
  updateEsocRequest,
} from "./services/esocService";
export { esocKeys } from "./queryKeys";

export type {
  ListEsocParams,
  EsocChecklist,
  EsocClub,
  EsocClubPerson,
  EsocDate,
  EsocDatePayload,
  EsocDocumentKey,
  EsocRequestRow,
  EsocStatus,
  SubmitEsocPayload,
  SubmitEsocResponse,
  UpdateEsocPayload,
} from "./services/esocService";
