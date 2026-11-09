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

export interface ExpoTeam {
  id: string;
  team_name: string;
  team_category: string;
  team_category_display: string;
  booth_number: string;
}

export interface JudgeAssignment {
  id: string;
  judge: string;
  judge_name: string;
  is_backup_judge: boolean;
  student: string;
  team_name: string;
  booth_number: string;
  team_category: string;
  timeslot: string;
  timeslot_display: string;
}

export interface AssignmentShortfall {
  student_id: string;
  team_name: string;
  booth_number: string;
  team_category: string;
  assigned: number;
  required: number;
  reason: string;
}

export interface GenerateAssignmentsResponse {
  status: string;
  assignments: JudgeAssignment[];
  shortfalls: AssignmentShortfall[];
}

/**
 * Authenticated GET — list EXPO student teams.
 */
export async function getTeams(): Promise<ExpoTeam[]> {
  const { data } = await api.get<ExpoTeam[]>("/api/expo/students/", { headers: authHeader() });
  return Array.isArray(data) ? data : [];
}

/**
 * Authenticated GET — list the current judge schedule.
 */
export async function getAssignments(): Promise<JudgeAssignment[]> {
  const { data } = await api.get<JudgeAssignment[]>("/api/expo/assignments/", {
    headers: authHeader(),
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Authenticated POST — run the scheduler and replace all existing assignments.
 */
export async function generateAssignments(
  minJudges: number,
  maxJudges: number | null
): Promise<GenerateAssignmentsResponse> {
  const { data } = await api.post<GenerateAssignmentsResponse>(
    "/api/expo/assignments/generate/",
    { min_judges: minJudges, max_judges: maxJudges },
    { headers: authHeader() }
  );
  return data;
}

export { formatErrorMessage } from "@shared/lib/formatError";
