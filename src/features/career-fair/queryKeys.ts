export const careerFairKeys = {
  representatives: ["career-fair-representatives"] as const,
  representativesWithSearch: (search: string) =>
    [...careerFairKeys.representatives, search] as const,
};
