export const innovationKeys = {
  all: ["innovation"] as const,
  rooms: () => [...innovationKeys.all, "rooms"] as const,
  judges: () => [...innovationKeys.all, "judges"] as const,
  teams: () => [...innovationKeys.all, "teams"] as const,
};