export const expoKeys = {
  judges: ["expo-judges"] as const,
  judgesWithSearch: (search: string) => [...expoKeys.judges, search] as const,
};
