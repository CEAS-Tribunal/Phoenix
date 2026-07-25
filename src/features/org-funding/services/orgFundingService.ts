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
export type OrgFundingDocumentKey =
  | "w9"
  | "application"
  | "slides"
  | "travelAuthorization";

/** Lifecycle of a single funding request as tracked by the org funding chair. */
export type OrgFundingStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "denied"
  | "funded";

/** An extra person the requester wants looped in on the funding process (e.g. a treasurer). */
export interface OrgFundingContact {
  name: string;
  email: string;
  position: string;
}

/**
 * Payload for the public submission form. Backend endpoint:
 * `POST /api/org-funding/` (multipart/form-data, no auth — orgs submit without an account).
 */
export interface SubmitOrgFundingPayload {
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
  additionalContacts: OrgFundingContact[];
  w9: File;
  application: File;
  slides: File;
  travelAuthorization?: File | null;
}

export interface SubmitOrgFundingResponse {
  message: string;
  id: number;
}

export async function submitOrgFundingRequest(
  payload: SubmitOrgFundingPayload
): Promise<SubmitOrgFundingResponse> {
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
  formData.append(
    "additional_contacts",
    JSON.stringify(payload.additionalContacts ?? [])
  );
  formData.append("w9", payload.w9);
  formData.append("application", payload.application);
  formData.append("slides", payload.slides);
  if (payload.travelAuthorization) {
    formData.append("travel_authorization", payload.travelAuthorization);
  }

  const { data } = await api.post<SubmitOrgFundingResponse>(
    "/api/org-funding/",
    formData
  );
  return data;
}

/** Per-request checklist mirroring the required items from the survival guide. */
export interface OrgFundingChecklist {
  w9: boolean;
  application: boolean;
  slides: boolean;
  travel_authorization: boolean;
}

export interface OrgFundingRequestRow {
  id: number;
  organization_name: string;
  requester_name: string;
  requester_email: string;
  m_number: string;
  position: string;
  requested_amount: string | null;
  purpose: string;
  involves_travel: boolean;
  status: OrgFundingStatus;
  funding_date: string | null;
  additional_contacts: OrgFundingContact[];
  w9_url: string | null;
  w9_filename: string | null;
  application_url: string | null;
  application_filename: string | null;
  slides_url: string | null;
  slides_filename: string | null;
  travel_authorization_url: string | null;
  travel_authorization_filename: string | null;
  checklist: OrgFundingChecklist;
  chair_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListOrgFundingParams {
  search?: string;
  /** Omit to skip server filter (show all statuses). */
  status?: OrgFundingStatus;
}

export async function listOrgFundingRequests(
  params?: ListOrgFundingParams
): Promise<OrgFundingRequestRow[]> {
  const sp = new URLSearchParams();
  if (params?.search?.trim()) sp.set("search", params.search.trim());
  if (params?.status) sp.set("status", params.status);
  const q = sp.toString();
  const path = q ? `/api/org-funding/requests/?${q}` : "/api/org-funding/requests/";
  const { data } = await api.get<OrgFundingRequestRow[]>(path, {
    headers: authHeader(),
  });
  return data;
}

export async function getOrgFundingRequest(
  id: number
): Promise<OrgFundingRequestRow> {
  const { data } = await api.get<OrgFundingRequestRow>(
    `/api/org-funding/requests/${id}/`,
    { headers: authHeader() }
  );
  return data;
}

export interface UpdateOrgFundingPayload {
  status?: OrgFundingStatus;
  checklist?: Partial<OrgFundingChecklist>;
  chair_notes?: string;
}

export async function updateOrgFundingRequest(
  id: number,
  payload: UpdateOrgFundingPayload
): Promise<OrgFundingRequestRow> {
  const { data } = await api.patch<OrgFundingRequestRow>(
    `/api/org-funding/requests/${id}/`,
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
 * Save an org funding attachment locally. Uses the staff JWT when fetching so protected
 * media can be retrieved as a blob; falls back to a normal link if that fails.
 */
export async function downloadOrgFundingAttachment(
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
export interface OrgFundingDate {
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
export async function listOpenOrgFundingDates(): Promise<OrgFundingDate[]> {
  const { data } = await api.get<OrgFundingDate[]>("/api/org-funding/dates/");
  return data;
}

/** Chair list of all dates (open and closed). */
export async function listAllOrgFundingDates(): Promise<OrgFundingDate[]> {
  const { data } = await api.get<OrgFundingDate[]>("/api/org-funding/dates/all/", {
    headers: authHeader(),
  });
  return data;
}

export interface OrgFundingDatePayload {
  date: string;
  label: string;
  notes?: string;
  capacity?: number | null;
  is_open?: boolean;
}

export async function createOrgFundingDate(
  payload: OrgFundingDatePayload
): Promise<OrgFundingDate> {
  const { data } = await api.post<OrgFundingDate>(
    "/api/org-funding/dates/",
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

export async function updateOrgFundingDate(
  id: number,
  payload: Partial<OrgFundingDatePayload>
): Promise<OrgFundingDate> {
  const { data } = await api.patch<OrgFundingDate>(
    `/api/org-funding/dates/${id}/`,
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

export async function deleteOrgFundingDate(id: number): Promise<void> {
  await api.delete(`/api/org-funding/dates/${id}/`, {
    headers: authHeader(),
  });
}
