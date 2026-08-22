import { lazy } from "react";

export const ResumeReviewEmployer = lazy(
  () => import("./pages/ResumeReviewEmployer")
);
export const ResumeReviewStudent = lazy(
  () => import("./pages/ResumeReviewStudent")
);
export const AdminResumeRosterPage = lazy(
  () => import("./pages/AdminResumeRosterPage")
);

export { ResumeReviewDay } from "./services/resumeReviewService";
export { rrdKeys } from "./queryKeys";

export type {
  AssignedTimeslotEntry,
  EmployerData,
  EmployerListItem,
  EmployerRegisterResponse,
  EmployerTimeslot,
  GetTimeslotsParams,
  RosterEmployer,
  RosterSlot,
  RosterStudent,
  StudentData,
  StudentResponse,
  Timeslot,
} from "./services/resumeReviewService";
