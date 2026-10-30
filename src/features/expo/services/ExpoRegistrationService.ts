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

export interface Judge {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  employer_name: string;
  judging_category: string[];
  judging_category_display: string[];
  judging_timeslot: string[];
  judging_timeslot_display: string[];
  number_of_projects: number;
  is_backup_judge: boolean;
  is_attending_lunch: boolean;
  lunch_preference: string | null;
  lunch_preference_display: string | null;
  dietary_restrictions: string | null;
  judge_pin: string;
  has_checked_in: boolean;
}

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Authenticated GET — list judges; optional search on name, email, phone, and employer.
 */
export async function getJudges(search?: string): Promise<Judge[]> {
  const params = new URLSearchParams();
  const q = (search ?? "").trim();
  if (q) params.set("search", q);

  const query = params.toString();
  const url = query.length > 0 ? `/api/expo/judges/?${query}` : "/api/expo/judges/";

  const { data } = await api.get<Judge[]>(url, { headers: authHeader() });
  return Array.isArray(data) ? data : [];
}

/**
 * Authenticated PATCH — mark whether a judge has checked in.
 */
export async function setJudgeCheckedIn(id: string, hasCheckedIn: boolean): Promise<Judge> {
  const { data } = await api.patch<Judge>(
    `/api/expo/judges/${id}/check-in/`,
    { has_checked_in: hasCheckedIn },
    { headers: authHeader() }
  );
  return data;
}

export { formatErrorMessage } from "@shared/lib/formatError";
