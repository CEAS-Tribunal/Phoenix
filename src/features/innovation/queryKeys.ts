import type { InnovationResultFilters } from "./services/innovationService";

export const innovationKeys = {
  all: ["innovation"] as const,
  rooms: () => [...innovationKeys.all, "rooms"] as const,
  roomConfiguration: () =>
    [...innovationKeys.all, "room-configuration"] as const,
  judges: () => [...innovationKeys.all, "judges"] as const,
  teams: () => [...innovationKeys.all, "teams"] as const,
  results: (filters?: InnovationResultFilters) =>
    filters === undefined
      ? [...innovationKeys.all, "results"] as const
      : [...innovationKeys.all, "results", filters] as const,
  submissions: (teamId?: number) =>
    teamId === undefined
      ? [...innovationKeys.all, "submissions"] as const
      : [...innovationKeys.all, "submissions", teamId] as const,
};