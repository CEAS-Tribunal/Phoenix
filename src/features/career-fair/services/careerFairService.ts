import axios from "axios";

import { getAccessToken, registerAdminApiAuthRefresh } from "@auth";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

registerAdminApiAuthRefresh(api);

export interface Representative {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  booth_location: string;
  building_location: string;
  signed_in_at: string;
  is_printed: boolean;
}

export interface RepresentativePayload {
  name: string;
  company: string;
  title: string;
  email: string;
  booth_location: string;
  building_location: string;
}

import { careerFairKeys } from "../queryKeys";

/** TanStack Query key prefix for representative lists (search adds a second segment). */
export const CAREER_FAIR_REPRESENTATIVES_QUERY_KEY = careerFairKeys.representatives;

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Public POST — representative sign-in (no JWT).
 */
export async function signInRepresentative(
  payload: RepresentativePayload
): Promise<Representative> {
  const { data } = await api.post<Representative>(
    "/api/career-fair/representatives/",
    payload
  );
  return data;
}

/**
 * Authenticated GET — list representatives; optional search on name/company.
 */
export async function getRepresentatives(search?: string): Promise<Representative[]> {
  const params = new URLSearchParams();
  const q = (search ?? "").trim();
  if (q) params.set("search", q);

  const query = params.toString();
  const url =
    query.length > 0
      ? `/api/career-fair/representatives/?${query}`
      : "/api/career-fair/representatives/";

  const { data } = await api.get<Representative[]>(url, {
    headers: authHeader(),
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Authenticated PATCH — mark whether a representative name tag has been printed.
 */
export async function markRepresentativePrinted(
  id: string,
  isPrinted = true
): Promise<Representative> {
  const { data } = await api.patch<Representative>(
    `/api/career-fair/representatives/${id}/printed/`,
    { is_printed: isPrinted },
    { headers: authHeader() }
  );
  return data;
}

export { formatErrorMessage } from "@shared/lib/formatError";
