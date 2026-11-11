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

export async function listInnovationRooms(): Promise<InnovationRoomOption[]> {
  const { data } = await api.get<InnovationRoomOption[]>("/api/innovation/rooms/", {
    headers: authHeaders(),
  });
  return data;
}

export async function listJudges(): Promise<InnovationJudge[]> {
  const { data } = await api.get<InnovationJudge[]>("/api/innovation/judges/", {
    headers: authHeaders(),
  });
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
