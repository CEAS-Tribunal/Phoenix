import axios from "axios";

import { getAccessToken, registerAdminApiAuthRefresh } from "@/services/AuthService";

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

export interface SubmitReimbursementPayload {
  /** ISO date string YYYY-MM-DD (from `<input type="date">`). */
  date: string;
  /** University / payroll M number (entered by the submitter). */
  mNumber: string;
  vendorName: string;
  amount: string;
  description: string;
  budgeted: boolean;
  nonBudgetedOfficerName?: string;
  nonBudgetedOfficerPosition?: string;
  reimbursementType: "direct-deposit" | "check";
  reimbursementAddressLine1?: string;
  reimbursementAddressLine2?: string;
  reimbursementAddressCity?: string;
  reimbursementAddressState?: string;
  reimbursementAddressZip?: string;
  icCompetition?: boolean;
  icParticipantName?: string;
  icParticipantRole?: string;
  icParticipantEmail?: string;
  itemizedReceipt: File;
  supportingDocument?: File | null;
}

export interface SubmitReimbursementResponse {
  message: string;
  id: number;
}

/**
 * Staff JWT — name, email, role, and vendor ID come from User + reimbursement profile.
 */
export async function submitReimbursementRequest(
  payload: SubmitReimbursementPayload
): Promise<SubmitReimbursementResponse> {
  const formData = new FormData();
  formData.append("date", payload.date);
  formData.append("m_number", payload.mNumber);
  formData.append("vendor_name", payload.vendorName);
  formData.append("amount", payload.amount);
  formData.append("description", payload.description);
  formData.append("budgeted", payload.budgeted ? "true" : "false");
  formData.append("reimbursement_type", payload.reimbursementType);
  if (payload.nonBudgetedOfficerName) {
    formData.append("non_budgeted_officer_name", payload.nonBudgetedOfficerName);
  }
  if (payload.nonBudgetedOfficerPosition) {
    formData.append("non_budgeted_officer_position", payload.nonBudgetedOfficerPosition);
  }
  if (payload.reimbursementAddressLine1) {
    formData.append("reimbursement_address_line1", payload.reimbursementAddressLine1);
  }
  if (payload.reimbursementAddressLine2) {
    formData.append("reimbursement_address_line2", payload.reimbursementAddressLine2);
  }
  if (payload.reimbursementAddressCity) {
    formData.append("reimbursement_address_city", payload.reimbursementAddressCity);
  }
  if (payload.reimbursementAddressState) {
    formData.append("reimbursement_address_state", payload.reimbursementAddressState);
  }
  if (payload.reimbursementAddressZip) {
    formData.append("reimbursement_address_zip", payload.reimbursementAddressZip);
  }
  formData.append("ic_competition", payload.icCompetition ? "true" : "false");
  if (payload.icParticipantName) {
    formData.append("ic_participant_name", payload.icParticipantName);
  }
  if (payload.icParticipantRole) {
    formData.append("ic_participant_role", payload.icParticipantRole);
  }
  if (payload.icParticipantEmail) {
    formData.append("ic_participant_email", payload.icParticipantEmail);
  }
  formData.append("itemized_receipt", payload.itemizedReceipt);
  if (payload.supportingDocument) {
    formData.append("supporting_document", payload.supportingDocument);
  }

  const { data } = await api.post<SubmitReimbursementResponse>("/api/reimbursement/", formData, {
    headers: authHeader(),
  });
  return data;
}

export interface ReimbursementRequestRow {
  id: number;
  name: string;
  position: string;
  email: string;
  m_number: string;
  vendor_id: string;
  date: string | null;
  vendor_name: string;
  amount: string;
  description: string;
  budgeted: boolean;
  reimbursement_type: string;
  reimbursement_address_line1?: string;
  reimbursement_address_line2?: string;
  reimbursement_address_city?: string;
  reimbursement_address_state?: string;
  reimbursement_address_zip?: string;
  non_budgeted_officer_name?: string;
  non_budgeted_officer_position?: string;
  ic_competition?: boolean;
  ic_participant_name?: string;
  ic_participant_role?: string;
  ic_participant_email?: string;
  itemized_receipt_url: string | null;
  /** Original upload filename for downloads (from API). */
  itemized_receipt_filename?: string | null;
  supporting_document_url: string | null;
  supporting_document_filename?: string | null;
  filed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Save a reimbursement attachment locally. Uses the staff JWT when fetching so
 * protected media can be retrieved as a blob; falls back to a normal link if that fails.
 */
export async function downloadReimbursementAttachment(
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

export interface ListReimbursementsParams {
  search?: string;
  /** Omit to skip server filter (show all). */
  filed?: boolean;
  reimbursement_type?: string;
}

export async function listReimbursementRequests(
  params?: ListReimbursementsParams
): Promise<ReimbursementRequestRow[]> {
  const sp = new URLSearchParams();
  if (params?.search?.trim()) sp.set("search", params.search.trim());
  if (params?.filed === true) sp.set("filed", "true");
  if (params?.filed === false) sp.set("filed", "false");
  if (params?.reimbursement_type?.trim()) {
    sp.set("reimbursement_type", params.reimbursement_type.trim());
  }
  const q = sp.toString();
  const path = q ? `/api/reimbursement/requests/?${q}` : "/api/reimbursement/requests/";
  const { data } = await api.get<ReimbursementRequestRow[]>(path, {
    headers: authHeader(),
  });
  return data;
}

export async function patchReimbursementFiled(
  id: number,
  filed: boolean
): Promise<ReimbursementRequestRow> {
  const { data } = await api.patch<ReimbursementRequestRow>(
    `/api/reimbursement/requests/${id}/filed/`,
    { filed },
    {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}
