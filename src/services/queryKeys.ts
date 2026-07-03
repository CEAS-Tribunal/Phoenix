import type { ListReimbursementsParams } from "@/services/ReimbursementService";
import type { GetTimeslotsParams } from "@/services/ResumeReviewService";

export const reimbursementKeys = {
  all: ["reimbursement-requests"] as const,
  list: (params?: ListReimbursementsParams) =>
    [...reimbursementKeys.all, params] as const,
};

export const rrdKeys = {
  all: ["rrd"] as const,
  employers: ["rrd-employers"] as const,
  roster: ["rrd-roster"] as const,
  timeslots: (params?: GetTimeslotsParams) => ["rrd-timeslots", params] as const,
};

export const committeesKeys = {
  all: ["committees"] as const,
  execRoleWithMembers: ["committees", "exec-role-with-members"] as const,
};

export const careerFairKeys = {
  representatives: ["career-fair-representatives"] as const,
  representativesWithSearch: (search: string) =>
    [...careerFairKeys.representatives, search] as const,
};
