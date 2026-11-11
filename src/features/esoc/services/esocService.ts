import axios from "axios";

import { getAccessToken, registerAdminApiAuthRefresh } from "@auth";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL = HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

registerAdminApiAuthRefresh(api);

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Which of the required documents a submission covers. `travelAuthorization` is only
 * relevant when the funding request involves travel (see the survival guide checklist).
 */
export type EsocDocumentKey =
  | "w9"
  | "application"
  | "slides"
  | "travelAuthorization";

/** Lifecycle of a single funding request as tracked by the ESOC chair. */
export type EsocStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "denied"
  | "funded";

/** A person representing an additional club on the funding request. */
export interface EsocClubPerson {
  name: string;
  email: string;
  role: string;
}

/** An additional club participating in the funding request. */
export interface EsocClub {
  clubName: string;
  people: EsocClubPerson[];
}

/**
 * Payload for the public submission form. Backend endpoint:
 * `POST /api/esoc/` (multipart/form-data, no auth — orgs submit without an account).
 */
export interface SubmitEsocPayload {
  organizationName: string;
  requesterName: string;
  requesterEmail: string;
  mNumber: string;
  position: string;
  requestedAmount?: string;
  purpose: string;
  involvesTravel: boolean;
  /** Optional funding date the requester picked from the chair's available dates. */
  fundingDateId?: number | null;
  additionalClubs: EsocClub[];
  w9: File;
  application: File;
  slides: File;
  travelAuthorization?: File | null;
}

export interface SubmitEsocResponse {
  message: string;
  id: number;
}

export async function submitEsocRequest(
  payload: SubmitEsocPayload
): Promise<SubmitEsocResponse> {
  const formData = new FormData();
  formData.append("organization_name", payload.organizationName);
  formData.append("requester_name", payload.requesterName);
  formData.append("requester_email", payload.requesterEmail);
  formData.append("m_number", payload.mNumber);
  formData.append("position", payload.position);
  if (payload.requestedAmount) {
    formData.append("requested_amount", payload.requestedAmount);
  }
  formData.append("purpose", payload.purpose);
  formData.append("involves_travel", payload.involvesTravel ? "true" : "false");
  if (payload.fundingDateId != null) {
    formData.append("funding_date", String(payload.fundingDateId));
  }
  for (const [clubIndex, club] of (payload.additionalClubs ?? []).entries()) {
    formData.append(`additional_club_${clubIndex}_name`, club.clubName);
    for (const [personIndex, person] of club.people.entries()) {
      const prefix = `additional_club_${clubIndex}_person_${personIndex}`;
      formData.append(`${prefix}_name`, person.name);
      formData.append(`${prefix}_email`, person.email);
      formData.append(`${prefix}_role`, person.role);
    }
  }
  formData.append("w9", payload.w9);
  formData.append("application", payload.application);
  formData.append("slides", payload.slides);
  if (payload.travelAuthorization) {
    formData.append("travel_authorization", payload.travelAuthorization);
  }

  const { data } = await api.post<SubmitEsocResponse>(
    "/api/esoc/",
    formData
  );
  return data;
}

/** Per-request checklist mirroring the required items from the survival guide. */
export interface EsocChecklist {
  w9: boolean;
  application: boolean;
  slides: boolean;
  travel_authorization: boolean;
}

export interface EsocRequestRow {
  id: number;
  organization_name: string;
  requester_name: string;
  requester_email: string;
  m_number: string;
  position: string;
  requested_amount: string | null;
  purpose: string;
  involves_travel: boolean;
  status: EsocStatus;
  funding_date: string | null;
  additional_contacts: EsocClub[];
  w9_url: string | null;
  w9_filename: string | null;
  application_url: string | null;
  application_filename: string | null;
  slides_url: string | null;
  slides_filename: string | null;
  travel_authorization_url: string | null;
  travel_authorization_filename: string | null;
  checklist: EsocChecklist;
  chair_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListEsocParams {
  search?: string;
  /** Omit to skip server filter (show all statuses). */
  status?: EsocStatus;
}

export async function listEsocRequests(
  params?: ListEsocParams
): Promise<EsocRequestRow[]> {
  const sp = new URLSearchParams();
  if (params?.search?.trim()) sp.set("search", params.search.trim());
  if (params?.status) sp.set("status", params.status);
  const q = sp.toString();
  const path = q ? `/api/esoc/requests/?${q}` : "/api/esoc/requests/";
  const { data } = await api.get<EsocRequestRow[]>(path, {
    headers: authHeader(),
  });
  return data;
}

export async function getEsocRequest(
  id: number
): Promise<EsocRequestRow> {
  const { data } = await api.get<EsocRequestRow>(
    `/api/esoc/requests/${id}/`,
    { headers: authHeader() }
  );
  return data;
}

export interface UpdateEsocPayload {
  status?: EsocStatus;
  checklist?: Partial<EsocChecklist>;
  chair_notes?: string;
}

export async function updateEsocRequest(
  id: number,
  payload: UpdateEsocPayload
): Promise<EsocRequestRow> {
  const { data } = await api.patch<EsocRequestRow>(
    `/api/esoc/requests/${id}/`,
    payload,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

/**
 * Save an ESOC attachment locally. Uses the staff JWT when fetching so protected
 * media can be retrieved as a blob; falls back to a normal link if that fails.
 */
export async function downloadEsocAttachment(
  url: string,
  filename: string
): Promise<void> {
  const safeName = filename.trim() || "download";
  const token = getAccessToken();
  try {
    const { data } = await axios.get<Blob>(url, {
      responseType: "blob",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const objectUrl = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/** A funding window/date the chair opens up for orgs to request or present against. */
export interface EsocDate {
  id: number;
  /** ISO date string YYYY-MM-DD. */
  date: string;
  label: string;
  notes: string | null;
  capacity: number | null;
  is_open: boolean;
  /** How many submissions already picked this date (from API, optional). */
  requests_count?: number;
}

/** Public list of open dates for the submission form. */
export async function listOpenEsocDates(): Promise<EsocDate[]> {
  const { data } = await api.get<EsocDate[]>("/api/esoc/dates/");
  return data;
}

/** Chair list of all dates (open and closed). */
export async function listAllEsocDates(): Promise<EsocDate[]> {
  const { data } = await api.get<EsocDate[]>("/api/esoc/dates/all/", {
    headers: authHeader(),
  });
  return data;
}

export interface EsocDatePayload {
  date: string;
  label: string;
  notes?: string;
  capacity?: number | null;
  is_open?: boolean;
}

export async function createEsocDate(
  payload: EsocDatePayload
): Promise<EsocDate> {
  const { data } = await api.post<EsocDate>(
    "/api/esoc/dates/",
    payload,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function updateEsocDate(
  id: number,
  payload: Partial<EsocDatePayload>
): Promise<EsocDate> {
  const { data } = await api.patch<EsocDate>(
    `/api/esoc/dates/${id}/`,
    payload,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function deleteEsocDate(id: number): Promise<void> {
  await api.delete(`/api/esoc/dates/${id}/`, {
    headers: authHeader(),
  });
}
