import { lazy } from "react";

export const CommitteesPage = lazy(() => import("./pages/CommitteesPage"));

export { CommitteesService } from "./services/committeesService";
export { committeesKeys } from "./queryKeys";

export type {
  Committee,
  CommitteeColor,
  ExecMemberPerson,
  ExecRoleItem,
  ExecRoleSection,
} from "./services/committeesService";
