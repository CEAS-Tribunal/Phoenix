import type { ListOrgFundingParams } from "./services/orgFundingService";

export const orgFundingKeys = {
  all: ["org-funding"] as const,
  requests: () => [...orgFundingKeys.all, "requests"] as const,
  list: (params?: ListOrgFundingParams) =>
    [...orgFundingKeys.requests(), params] as const,
  detail: (id: number) => [...orgFundingKeys.requests(), "detail", id] as const,
  dates: () => [...orgFundingKeys.all, "dates"] as const,
  openDates: () => [...orgFundingKeys.dates(), "open"] as const,
  allDates: () => [...orgFundingKeys.dates(), "all"] as const,
};
