import type { ListEsocParams } from "./services/esocService";

export const esocKeys = {
  all: ["esoc"] as const,
  requests: () => [...esocKeys.all, "requests"] as const,
  list: (params?: ListEsocParams) =>
    [...esocKeys.requests(), params] as const,
  detail: (id: number) => [...esocKeys.requests(), "detail", id] as const,
  dates: () => [...esocKeys.all, "dates"] as const,
  openDates: () => [...esocKeys.dates(), "open"] as const,
  allDates: () => [...esocKeys.dates(), "all"] as const,
};
