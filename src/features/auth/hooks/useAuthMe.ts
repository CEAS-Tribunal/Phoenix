import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  getAuthMeQueryKey,
  refreshMe,
  type AuthMeResponse,
} from "../services/authService";

type AuthMeQueryKey = ReturnType<typeof getAuthMeQueryKey>;

type AuthMeQueryOptions = Omit<
  UseQueryOptions<AuthMeResponse, Error, AuthMeResponse, AuthMeQueryKey>,
  "queryKey" | "queryFn"
>;

export function useAuthMe(options?: AuthMeQueryOptions) {
  return useQuery({
    queryKey: getAuthMeQueryKey(),
    queryFn: refreshMe,
    ...options,
  });
}
