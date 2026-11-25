export const expoKeys = {
  judges: ["expo-judges"] as const,
  judgesWithSearch: (search: string) => [...expoKeys.judges, search] as const,
  teams: ["expo-teams"] as const,
  assignments: ["expo-assignments"] as const,
};
