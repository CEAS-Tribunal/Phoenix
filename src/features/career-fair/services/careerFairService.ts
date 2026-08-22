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

interface PaginatedRepresentatives {
  count: number;
  next: string | null;
  previous: string | null;
  results: Representative[];
}

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function isPaginated(data: unknown): data is PaginatedRepresentatives {
  return (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray((data as PaginatedRepresentatives).results)
  );
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

async function fetchRepresentativesPage(
  pageUrl: string
): Promise<{ items: Representative[]; next: string | null }> {
  const response = await api.get<PaginatedRepresentatives | Representative[]>(pageUrl, {
    headers: authHeader(),
  });
  const body = response.data;
  if (Array.isArray(body)) {
    return { items: body, next: null };
  }
  if (isPaginated(body)) {
    return { items: body.results, next: body.next };
  }
  return { items: [], next: null };
}

/**
 * Authenticated GET — list representatives; optional search on name/company.
 * Follows DRF pagination until all pages are loaded.
 */
export async function getRepresentatives(search?: string): Promise<Representative[]> {
  const params = new URLSearchParams();
  const q = (search ?? "").trim();
  if (q) params.set("search", q);

  const query = params.toString();
  let nextUrl: string | null =
    query.length > 0
      ? `/api/career-fair/representatives/?${query}`
      : "/api/career-fair/representatives/";

  const collected: Representative[] = [];

  while (nextUrl) {
    const { items, next } = await fetchRepresentativesPage(nextUrl);
    collected.push(...items);
    nextUrl = next;
  }

  return collected;
}

export { formatErrorMessage } from "@shared/lib/formatError";
