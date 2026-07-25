import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  HandCoins,
  Search,
  Users,
  X,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { cn } from "@shared/lib/utils";
import { formatErrorMessage } from "@shared/lib/formatError";
import {
  getCachedUsername,
  logoutWithQueryClient,
  useAuthMe,
  type AuthMeResponse,
} from "@auth";
import { ORG_FUNDING_DOCUMENTS } from "../data/orgFundingContent";
import {
  downloadOrgFundingAttachment,
  getOrgFundingRequest,
  listOrgFundingRequests,
  updateOrgFundingRequest,
  type OrgFundingChecklist,
  type OrgFundingRequestRow,
  type OrgFundingStatus,
} from "../services/orgFundingService";
import { orgFundingKeys } from "../queryKeys";

function displayNameFromMe(me: AuthMeResponse): string {
  const full = `${me.first_name} ${me.last_name}`.trim();
  return full || me.username;
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const submittedFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDateLabel(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

const STATUS_META: Record<
  OrgFundingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  },
  in_review: {
    label: "In review",
    className: "bg-blue-100 text-blue-900 ring-1 ring-blue-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200",
  },
  denied: {
    label: "Denied",
    className: "bg-rose-100 text-rose-900 ring-1 ring-rose-200",
  },
  funded: {
    label: "Funded",
    className: "bg-violet-100 text-violet-900 ring-1 ring-violet-200",
  },
};

const STATUS_ORDER: OrgFundingStatus[] = [
  "pending",
  "in_review",
  "approved",
  "denied",
  "funded",
];

/** Map each checklist key to the matching document url/filename on a row. */
function documentFor(
  row: OrgFundingRequestRow,
  key: keyof OrgFundingChecklist
): { url: string | null; filename: string | null } {
  switch (key) {
    case "w9":
      return { url: row.w9_url, filename: row.w9_filename };
    case "application":
      return { url: row.application_url, filename: row.application_filename };
    case "slides":
      return { url: row.slides_url, filename: row.slides_filename };
    case "travel_authorization":
      return {
        url: row.travel_authorization_url,
        filename: row.travel_authorization_filename,
      };
    default:
      return { url: null, filename: null };
  }
}

const CHECKLIST_KEYS: (keyof OrgFundingChecklist)[] = [
  "w9",
  "application",
  "slides",
  "travel_authorization",
];

function checklistLabel(key: keyof OrgFundingChecklist): string {
  const camel =
    key === "travel_authorization" ? "travelAuthorization" : key;
  return (
    ORG_FUNDING_DOCUMENTS.find((d) => d.key === camel)?.label ?? key
  );
}

function checklistProgress(row: OrgFundingRequestRow): { done: number; total: number } {
  const relevant = CHECKLIST_KEYS.filter(
    (k) => k !== "travel_authorization" || row.involves_travel
  );
  const done = relevant.filter((k) => row.checklist[k]).length;
  return { done, total: relevant.length };
}

function AttachmentActions({
  url,
  suggestedFilename,
}: {
  url: string | null;
  suggestedFilename: string;
}) {
  if (!url) {
    return <span className="text-sm text-gray-400">Not provided</span>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 border-[#E00122]/30 bg-white px-2 text-[#E00122] hover:bg-red-50"
        onClick={() => void downloadOrgFundingAttachment(url, suggestedFilename)}
      >
        <Download className="h-3 w-3 shrink-0" />
        Download
      </Button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline-offset-2 hover:text-[#E00122] hover:underline"
      >
        Open
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function SubmissionDetail({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: orgFundingKeys.detail(id),
    queryFn: () => getOrgFundingRequest(id),
  });

  const [notesDraft, setNotesDraft] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrgFundingRequest>[1]) =>
      updateOrgFundingRequest(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(orgFundingKeys.detail(id), updated);
      void queryClient.invalidateQueries({ queryKey: orgFundingKeys.requests() });
    },
  });

  const row = detailQuery.data;
  const notesValue = notesDraft ?? row?.chair_notes ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Funding request details"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close details"
      />
      <motion.div
        initial={{ x: 40, opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
              Funding request
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {row?.organization_name ?? "Loading…"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-8 px-6 py-6">
          {detailQuery.isPending ? (
            <p className="text-sm text-gray-500">Loading request…</p>
          ) : detailQuery.isError || !row ? (
            <p className="text-sm text-red-600">
              {formatErrorMessage(detailQuery.error)}
            </p>
          ) : (
            <>
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-gray-500">
                  Status
                </Label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ORDER.map((s) => {
                    const active = row.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ status: s })}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          active
                            ? STATUS_META[s].className
                            : "bg-gray-50 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {STATUS_META[s].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requester */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  Requester
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">Name</dt>
                    <dd className="font-medium text-gray-900">{row.requester_name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="break-all font-medium text-gray-900">
                      <a
                        href={`mailto:${row.requester_email}`}
                        className="text-[#E00122] hover:underline"
                      >
                        {row.requester_email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">M number</dt>
                    <dd className="font-medium text-gray-900">{row.m_number}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Position</dt>
                    <dd className="font-medium text-gray-900">{row.position}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Requested amount</dt>
                    <dd className="font-medium text-gray-900">
                      {row.requested_amount
                        ? money.format(Number(row.requested_amount))
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Funding date</dt>
                    <dd className="flex items-center gap-1 font-medium text-gray-900">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                      {formatDateLabel(row.funding_date)}
                    </dd>
                  </div>
                </dl>
                <div>
                  <p className="text-gray-500 text-sm">Purpose</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                    {row.purpose}
                  </p>
                </div>
              </div>

              {/* Additional contacts */}
              {row.additional_contacts.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                    <Users className="h-4 w-4" />
                    Additional people
                  </h3>
                  <ul className="space-y-2">
                    {row.additional_contacts.map((c, i) => (
                      <li
                        key={`${c.email}-${i}`}
                        className="rounded-lg border border-gray-200 bg-slate-50/50 px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-gray-900">{c.name}</span>
                        {c.position ? (
                          <span className="text-gray-500"> — {c.position}</span>
                        ) : null}
                        <div className="text-xs text-gray-500">
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:text-[#E00122] hover:underline"
                          >
                            {c.email}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Document checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  Required documents checklist
                </h3>
                <p className="text-xs text-gray-500">
                  Toggle each item as you verify it. Download or open the file the org
                  submitted.
                </p>
                <ul className="space-y-3">
                  {CHECKLIST_KEYS.map((key) => {
                    const relevant =
                      key !== "travel_authorization" || row.involves_travel;
                    if (!relevant) return null;
                    const checked = row.checklist[key];
                    const doc = documentFor(row, key);
                    return (
                      <li
                        key={key}
                        className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <button
                          type="button"
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              checklist: { [key]: !checked },
                            })
                          }
                          className="flex items-center gap-2 text-left"
                        >
                          {checked ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                          )}
                          <span
                            className={cn(
                              "text-sm font-medium",
                              checked ? "text-gray-900" : "text-gray-600"
                            )}
                          >
                            {checklistLabel(key)}
                          </span>
                        </button>
                        <AttachmentActions
                          url={doc.url}
                          suggestedFilename={
                            doc.filename ?? `org-funding-${row.id}-${key}`
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Chair notes */}
              <div className="space-y-2">
                <Label
                  htmlFor="chair-notes"
                  className="text-xs uppercase tracking-wide text-gray-500"
                >
                  Committee notes
                </Label>
                <textarea
                  id="chair-notes"
                  value={notesValue}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  placeholder="Internal notes for the committee…"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/25"
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#E00122] text-white hover:bg-[#B8011C]"
                    disabled={
                      updateMutation.isPending ||
                      notesDraft === null ||
                      notesDraft === (row.chair_notes ?? "")
                    }
                    onClick={() =>
                      updateMutation.mutate({ chair_notes: notesValue })
                    }
                  >
                    Save notes
                  </Button>
                </div>
              </div>

              {updateMutation.isError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formatErrorMessage(updateMutation.error)}
                </p>
              ) : null}

              <p className="text-xs text-gray-400">
                Submitted {submittedFmt.format(new Date(row.created_at))}
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOrgFundingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tableSearch, setTableSearch] = useState("");
  const deferredSearch = useDeferredValue(tableSearch);
  const [statusFilter, setStatusFilter] = useState<"all" | OrgFundingStatus>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const meQuery = useAuthMe();

  const listParams = useMemo(() => {
    const p: Parameters<typeof listOrgFundingRequests>[0] = {
      search: deferredSearch.trim() || undefined,
    };
    if (statusFilter !== "all") p.status = statusFilter;
    return p;
  }, [deferredSearch, statusFilter]);

  const listQuery = useQuery({
    queryKey: orgFundingKeys.list(listParams),
    queryFn: () => listOrgFundingRequests(listParams),
  });

  const rows = useMemo(() => {
    const data = [...(listQuery.data ?? [])];
    data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return data;
  }, [listQuery.data]);

  const stats = useMemo(() => {
    const all = listQuery.data ?? [];
    return {
      total: all.length,
      pending: all.filter((r) => r.status === "pending").length,
      inReview: all.filter((r) => r.status === "in_review").length,
    };
  }, [listQuery.data]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    if (selectedId != null) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [selectedId]);

  function handleSignOut() {
    logoutWithQueryClient(queryClient);
    navigate("/admin/login", { replace: true });
  }

  const me = meQuery.data;
  const displayName = me
    ? displayNameFromMe(me)
    : (getCachedUsername() ?? "your account");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl 2xl:max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#E00122] hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin Dashboard
                </Link>
                <span className="hidden text-gray-300 sm:inline" aria-hidden>
                  |
                </span>
                <Link
                  to="/admin/org-funding/dates"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                >
                  <CalendarDays className="h-4 w-4" />
                  Manage available dates
                </Link>
              </div>

              <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {meQuery.isPending ? (
                  <p>Loading your account…</p>
                ) : (
                  <p>
                    Org Funding chair view — signed in as{" "}
                    <span className="font-medium text-gray-900">{displayName}</span>
                    {me?.email ? <span className="text-gray-500"> ({me.email})</span> : null}. To
                    use a different account,{" "}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="font-medium text-[#E00122] underline-offset-2 hover:underline"
                    >
                      sign out
                    </button>
                    .
                  </p>
                )}
              </div>

              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#E00122]">
                    <HandCoins className="h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                      Org funding submissions
                    </h1>
                  </div>
                  <p className="mt-1 max-w-3xl text-sm text-gray-600">
                    Review every funding request in one place. Open a submission to verify its
                    documents against the checklist, add committee notes, and update its status.
                  </p>
                </div>
              </div>

              {!listQuery.isLoading && !listQuery.isError && stats.total > 0 ? (
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-amber-200/90 bg-linear-to-br from-amber-50 to-orange-50/80 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">
                      Pending
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200/90 bg-linear-to-br from-blue-50 to-sky-50/80 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-900/80">
                      In review
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-blue-950">
                      {stats.inReview}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-slate-50/90 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Total submissions
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200/90 bg-linear-to-b from-white to-slate-50/40 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search organization, name, email, M number…"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="h-10 border-gray-200 bg-white pl-9 shadow-none"
                    aria-label="Filter submissions by text"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "all" | OrgFundingStatus)
                    }
                    className="h-10 min-w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/25"
                  >
                    <option value="all">All statuses</option>
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-slate-50/90">
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Submitted
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Organization
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Requester
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Amount
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Documents
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listQuery.isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                            Loading submissions…
                          </td>
                        </tr>
                      ) : listQuery.isError ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-red-600">
                            {formatErrorMessage(listQuery.error)}
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                            No submissions match your filters.
                          </td>
                        </tr>
                      ) : (
                        rows.map((row) => {
                          const progress = checklistProgress(row);
                          const complete = progress.done === progress.total;
                          return (
                            <tr
                              key={row.id}
                              className="cursor-pointer transition-colors hover:bg-slate-50/60"
                              onClick={() => setSelectedId(row.id)}
                            >
                              <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-700">
                                {submittedFmt.format(new Date(row.created_at))}
                              </td>
                              <td className="max-w-[200px] px-3 py-3">
                                <div className="font-medium text-gray-900">
                                  {row.organization_name}
                                </div>
                                {row.funding_date ? (
                                  <div className="text-xs text-gray-500">
                                    {formatDateLabel(row.funding_date)}
                                  </div>
                                ) : null}
                              </td>
                              <td className="max-w-[180px] px-3 py-3">
                                <div className="truncate text-gray-800">
                                  {row.requester_name}
                                </div>
                                <div className="truncate text-xs text-gray-500">
                                  {row.requester_email}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 font-medium tabular-nums text-gray-900">
                                {row.requested_amount
                                  ? money.format(Number(row.requested_amount))
                                  : "—"}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                    complete
                                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                                      : "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                                  )}
                                >
                                  {complete ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  ) : null}
                                  {progress.done}/{progress.total}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                    STATUS_META[row.status].className
                                  )}
                                >
                                  {STATUS_META[row.status].label}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(row.id);
                                  }}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {selectedId != null ? (
        <SubmissionDetail id={selectedId} onClose={() => setSelectedId(null)} />
      ) : null}
    </div>
  );
}
