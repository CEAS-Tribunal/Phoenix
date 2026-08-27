import type { GetTimeslotsParams } from "./services/resumeReviewService";

export const rrdKeys = {
  all: ["rrd"] as const,
  employers: ["rrd-employers"] as const,
  roster: ["rrd-roster"] as const,
  settings: ["rrd-settings"] as const,
  timeslots: (params?: GetTimeslotsParams) => ["rrd-timeslots", params] as const,
};
