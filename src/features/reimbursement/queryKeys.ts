import type { ListReimbursementsParams } from "./services/reimbursementService";

export const reimbursementKeys = {
  all: ["reimbursement-requests"] as const,
  list: (params?: ListReimbursementsParams) =>
    [...reimbursementKeys.all, params] as const,
};
