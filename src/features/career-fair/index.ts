import { lazy } from "react";

export const CareerFairPage = lazy(() => import("./pages/CareerFairPage"));
export const RepresentativeSignInPage = lazy(
  () => import("./pages/RepresentativeSignInPage")
);
export const AdminTagsPrintingPage = lazy(
  () => import("./pages/AdminTagsPrintingPage")
);

export {
  CAREER_FAIR_REPRESENTATIVES_QUERY_KEY,
  getRepresentatives,
  signInRepresentative,
} from "./services/careerFairService";
export { careerFairKeys } from "./queryKeys";

export type {
  Representative,
  RepresentativePayload,
} from "./services/careerFairService";
