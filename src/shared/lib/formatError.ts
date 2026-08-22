import axios, { type AxiosError } from "axios";

/** Human-readable message from an axios/API error, with sensible fallbacks. */
export function formatErrorMessage(err: unknown): string {
  const ax = err as AxiosError<Record<string, unknown>>;
  if (!axios.isAxiosError(err)) {
    return "Something went wrong. Please try again.";
  }
  const d = ax.response?.data;
  if (typeof d === "string") return d;
  if (d && typeof d === "object") {
    const detail = d.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length) return String(detail[0]);
    const nonField = d.non_field_errors;
    if (Array.isArray(nonField) && nonField.length) return String(nonField[0]);
    const firstKey = Object.keys(d)[0];
    const val = firstKey ? (d as Record<string, unknown>)[firstKey] : undefined;
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === "string") return val;
  }
  if (ax.response?.status === 401) return "Invalid username or password.";
  if (ax.response?.status === 403) {
    const d403 = ax.response?.data;
    if (d403 && typeof d403 === "object" && typeof (d403 as { detail?: string }).detail === "string") {
      return (d403 as { detail: string }).detail;
    }
    return "Access denied. Staff accounts only.";
  }
  return "Request failed. Please try again.";
}
