import axios from "axios";
import { getAccessToken, registerAdminApiAuthRefresh } from "@auth";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL = HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

registerAdminApiAuthRefresh(api);

function authHeaders(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface InnovationJudge {
  id: number;
  name: string;
  room: string;
  is_active: boolean;
}

export interface InnovationTeam {
  id: number;
  name: string;
  room: string;
  is_active: boolean;
}

export interface InnovationRoomOption {
  value: string;
  label: string;
}

export interface InnovationRoomConfiguration {
  room_count: 2 | 3;
}

export interface InnovationResult {
  team_id: number;
  team_name: string;
  room: string;
  submission_count: number;
  average_score: number;
  average_z_score: number;
  average_corrected_score: number;
}

export interface InnovationResultFilters {
  judge_id?: number;
  room?: string;
}

export interface InnovationSubmission {
  id: number;
  judge_id: number;
  judge_name: string;
  team_id: number;
  team_name: string;
  room: string;
  scores: Record<string, number>;
  overall_score_correction: number;
  feedback: string;
  created_at: string;
  updated_at: string;
}

export interface SaveInnovationSubmissionPayload {
  judge_id: number;
  team_id: number;
  scores: Record<string, number>;
  feedback: string;
}

export async function listInnovationRooms(): Promise<InnovationRoomOption[]> {
  const { data } = await api.get<InnovationRoomOption[]>("/api/innovation/rooms/", {
    headers: authHeaders(),
  });
  return data;
}

export async function getInnovationRoomConfiguration(): Promise<InnovationRoomConfiguration> {
  const { data } = await api.get<InnovationRoomConfiguration>(
    "/api/innovation/room-configuration/",
    {
      headers: authHeaders(),
    }
  );
  return data;
}

export async function updateInnovationRoomConfiguration(
  roomCount: InnovationRoomConfiguration["room_count"]
): Promise<InnovationRoomConfiguration> {
  const { data } = await api.patch<InnovationRoomConfiguration>(
    "/api/innovation/room-configuration/",
    { room_count: roomCount },
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function listJudges(): Promise<InnovationJudge[]> {
  const { data } = await api.get<InnovationJudge[]>("/api/innovation/judges/", {
    headers: authHeaders(),
  });
  return data;
}

export async function listInnovationResults(
  filters?: InnovationResultFilters
): Promise<InnovationResult[]> {
  const params = new URLSearchParams();
  if (filters?.judge_id !== undefined) {
    params.set("judge_id", String(filters.judge_id));
  }
  if (filters?.room) {
    params.set("room", filters.room);
  }
  const query = params.toString();
  const path = query
    ? `/api/innovation/results/?${query}`
    : "/api/innovation/results/";
  const { data } = await api.get<InnovationResult[]>(path, {
    headers: authHeaders(),
  });
  return data;
}

export async function listInnovationSubmissions(
  teamId?: number
): Promise<InnovationSubmission[]> {
  const params = new URLSearchParams();
  if (teamId !== undefined) {
    params.set("team_id", String(teamId));
  }
  const query = params.toString();
  const path = query
    ? `/api/innovation/submissions/?${query}`
    : "/api/innovation/submissions/";
  const { data } = await api.get<InnovationSubmission[]>(path, {
    headers: authHeaders(),
  });
  return data;
}

export async function saveInnovationSubmission(
  payload: SaveInnovationSubmissionPayload
): Promise<InnovationSubmission> {
  const { data } = await api.post<InnovationSubmission>(
    "/api/innovation/submissions/",
    payload,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function createJudge(
  payload: Pick<InnovationJudge, "name" | "room">
): Promise<InnovationJudge> {
  const { data } = await api.post<InnovationJudge>("/api/innovation/judges/", payload, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });
  return data;
}

export async function updateJudge(
  id: number,
  payload: Pick<InnovationJudge, "name" | "room">
): Promise<InnovationJudge> {
  const { data } = await api.patch<InnovationJudge>(
    `/api/innovation/judges/${id}/`,
    payload,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function deleteJudge(id: number): Promise<void> {
  await api.delete(`/api/innovation/judges/${id}/`, {
    headers: authHeaders(),
  });
}

export async function listTeams(): Promise<InnovationTeam[]> {
  const { data } = await api.get<InnovationTeam[]>("/api/innovation/teams/", {
    headers: authHeaders(),
  });
  return data;
}

export async function createTeam(
  payload: Pick<InnovationTeam, "name" | "room">
): Promise<InnovationTeam> {
  const { data } = await api.post<InnovationTeam>("/api/innovation/teams/", payload, {
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });
  return data;
}

export async function updateTeam(
  id: number,
  payload: Pick<InnovationTeam, "name" | "room">
): Promise<InnovationTeam> {
  const { data } = await api.patch<InnovationTeam>(
    `/api/innovation/teams/${id}/`,
    payload,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function deleteTeam(id: number): Promise<void> {
  await api.delete(`/api/innovation/teams/${id}/`, {
    headers: authHeaders(),
  });
}
