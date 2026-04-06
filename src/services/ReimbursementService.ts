import axios from "axios";

import { getAccessToken } from "@/services/AuthService";

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL = HOST_URL !== undefined && HOST_URL !== "" ? HOST_URL : "";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export interface SubmitReimbursementPayload {
  /** ISO date string YYYY-MM-DD (from `<input type="date">`). */
  date: string;
  vendorName: string;
  amount: string;
  description: string;
  budgeted: boolean;
  reimbursementType: "direct-deposit" | "check";
  itemizedReceipt: File;
  supportingDocument?: File | null;
}

export interface SubmitReimbursementResponse {
  message: string;
  id: number;
}

/**
 * Staff JWT — member fields are filled server-side from User + reimbursement profile.
 */
export async function submitReimbursementRequest(
  payload: SubmitReimbursementPayload
): Promise<SubmitReimbursementResponse> {
  const formData = new FormData();
  formData.append("date", payload.date);
  formData.append("vendor_name", payload.vendorName);
  formData.append("amount", payload.amount);
  formData.append("description", payload.description);
  formData.append("budgeted", payload.budgeted ? "true" : "false");
  formData.append("reimbursement_type", payload.reimbursementType);
  formData.append("itemized_receipt", payload.itemizedReceipt);
  if (payload.supportingDocument) {
    formData.append("supporting_document", payload.supportingDocument);
  }

  const { data } = await api.post<SubmitReimbursementResponse>("/api/reimbursement/", formData, {
    headers: authHeader(),
  });
  return data;
}
