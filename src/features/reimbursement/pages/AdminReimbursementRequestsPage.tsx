import { useDeferredValue, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  LayoutList,
  Receipt,
  Search,
  Sparkles,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Switch } from "@shared/ui/switch";
import { cn } from "@shared/lib/utils";
import { formatErrorMessage } from "@shared/lib/formatError";
import {
  getCachedUsername,
  logoutWithQueryClient,
  useAuthMe,
  type AuthMeResponse,
} from "@auth";
import {
  downloadReimbursementAttachment,
  listReimbursementRequests,
  patchReimbursementFiled,
  type ReimbursementRequestRow,
} from "../services/reimbursementService";
import { reimbursementKeys } from "../queryKeys";

function displayNameFromMe(me: AuthMeResponse): string {
  const full = `${me.first_name} ${me.last_name}`.trim();
  return full || me.username;
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const submittedFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Treat as “new” for highlighting when submitted within this many days and still unfiled. */
const NEW_MS = 7 * 24 * 60 * 60 * 1000;

function isNewUnfiled(row: ReimbursementRequestRow): boolean {
  if (row.filed) return false;
  const t = new Date(row.created_at).getTime();
  return Number.isFinite(t) && Date.now() - t <= NEW_MS;
}

function needsAttention(row: ReimbursementRequestRow): boolean {
  return !row.filed;
}

function AttachmentActions({
  url,
  suggestedFilename,
  kind,
}: {
  url: string | null;
  suggestedFilename?: string | null;
  kind: "receipt" | "supporting";
}) {
  if (!url) {
    return <span className="text-gray-400">—</span>;
  }
  const downloadName =
    (suggestedFilename && suggestedFilename.trim()) ||
    (kind === "receipt" ? "itemized-receipt" : "supporting-document");

  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 border-[#E00122]/30 bg-white px-2 text-[#E00122] hover:bg-red-50"
          onClick={() => void downloadReimbursementAttachment(url, downloadName)}
          aria-label={`Download ${kind === "receipt" ? "itemized receipt" : "supporting document"}`}
        >
          <Download className="h-3 w-3 shrink-0" />
          Download
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-gray-600 underline-offset-2 hover:text-[#E00122] hover:underline"
        >
          Open
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default function AdminReimbursementRequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tableSearch, setTableSearch] = useState("");
  const deferredSearch = useDeferredValue(tableSearch);
  const [filedFilter, setFiledFilter] = useState<"all" | "filed" | "pending">("pending");
  const [typeFilter, setTypeFilter] = useState("");

  const meQuery = useAuthMe();

  const listParams = useMemo(() => {
    const p: Parameters<typeof listReimbursementRequests>[0] = {
      search: deferredSearch.trim() || undefined,
      reimbursement_type: typeFilter.trim() || undefined,
    };
    if (filedFilter === "filed") p.filed = true;
    if (filedFilter === "pending") p.filed = false;
    return p;
  }, [deferredSearch, filedFilter, typeFilter]);

  const listQuery = useQuery({
    queryKey: reimbursementKeys.list(listParams),
    queryFn: () => listReimbursementRequests(listParams),
  });

  const sortedRows = useMemo(() => {
    const rows = [...(listQuery.data ?? [])];
    rows.sort((a, b) => {
      const rank = (r: ReimbursementRequestRow) => (r.filed ? 1 : 0);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return rows;
  }, [listQuery.data]);

  const stats = useMemo(() => {
    const unfiled = sortedRows.filter((r) => !r.filed).length;
    const newUnfiled = sortedRows.filter(isNewUnfiled).length;
    return { total: sortedRows.length, unfiled, newUnfiled };
  }, [sortedRows]);

  const filedMutation = useMutation({
    mutationFn: ({ id, filed }: { id: number; filed: boolean }) =>
      patchReimbursementFiled(id, filed),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reimbursementKeys.all });
    },
  });

  function handleSignOut() {
    logoutWithQueryClient(queryClient);
    navigate("/admin/login", { replace: true });
  }

  const me = meQuery.data;
  const displayName = me
    ? displayNameFromMe(me)
    : (getCachedUsername() ?? "your account");

  const colSpan = 12;

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
                  to="/admin/reimbursements"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                >
                  <Receipt className="h-4 w-4" />
                  Submit reimbursement form
                </Link>
              </div>

              <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {meQuery.isPending ? (
                  <p>Loading your account…</p>
                ) : (
                  <p>
                    Treasurer view — signed in as{" "}
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

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#E00122]">
                      <LayoutList className="h-6 w-6" />
                      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Reimbursement requests
                      </h1>
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-gray-600">
                      Unfiled and recent requests are highlighted. Default view is{" "}
                      <strong className="font-medium text-gray-800">not filed</strong> so new work
                      stays on top. Download itemized receipts and supporting documents from each
                      row.
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200/60">
                    Treasurer — filing status
                  </span>
                </div>

                {!listQuery.isLoading && !listQuery.isError && stats.total > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-amber-200/90 bg-linear-to-br from-amber-50 to-orange-50/80 px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">
                        Needs filing
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">
                        {stats.unfiled}
                      </p>
                      <p className="text-xs text-amber-900/70">In the current list</p>
                    </div>
                    <div className="rounded-xl border border-[#E00122]/25 bg-linear-to-br from-red-50/90 to-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8B0018]">
                        New &amp; unfiled (7 days)
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-[#E00122]">
                        {stats.newUnfiled}
                      </p>
                      <p className="text-xs text-gray-600">Highlighted in the table</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-slate-50/90 px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Rows shown
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
                        {stats.total}
                      </p>
                      <p className="text-xs text-gray-600">After search / filters</p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/90 bg-linear-to-b from-white to-slate-50/40 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="relative min-w-[200px] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search name, email, vendor, M number…"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="h-10 border-gray-200 bg-white pl-9 shadow-none"
                      aria-label="Filter requests by text"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Filing status</Label>
                      <select
                        value={filedFilter}
                        onChange={(e) =>
                          setFiledFilter(e.target.value as "all" | "filed" | "pending")
                        }
                        className="h-10 min-w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/25"
                      >
                        <option value="pending">Not filed (default)</option>
                        <option value="all">All</option>
                        <option value="filed">Filed</option>
                      </select>
                    </div>
                    <div className="space-y-1 min-w-[160px]">
                      <Label htmlFor="reimb-type-filter" className="text-xs text-gray-500">
                        Reimbursement type
                      </Label>
                      <Input
                        id="reimb-type-filter"
                        placeholder="Contains…"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 border-gray-200 bg-white shadow-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1280px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-slate-50/90">
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Attention
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Submitted
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Expense date
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Submitter
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Vendor
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            IC
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Amount
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Type
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Budgeted
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Itemized receipt
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Supporting docs
                          </th>
                          <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Filed
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {listQuery.isLoading ? (
                          <tr>
                            <td colSpan={colSpan} className="px-4 py-12 text-center text-gray-500">
                              Loading requests…
                            </td>
                          </tr>
                        ) : listQuery.isError ? (
                          <tr>
                            <td colSpan={colSpan} className="px-4 py-12 text-center text-red-600">
                              {formatErrorMessage(listQuery.error)}
                            </td>
                          </tr>
                        ) : sortedRows.length === 0 ? (
                          <tr>
                            <td colSpan={colSpan} className="px-4 py-12 text-center text-gray-500">
                              No requests match your filters.
                            </td>
                          </tr>
                        ) : (
                          sortedRows.map((row) => {
                            const attention = needsAttention(row);
                            const isNew = isNewUnfiled(row);
                            return (
                              <tr
                                key={row.id}
                                className={cn(
                                  "transition-colors",
                                  attention &&
                                    "border-l-[5px] border-l-amber-500 bg-amber-50/45 hover:bg-amber-50/70",
                                  isNew &&
                                    "bg-linear-to-r from-red-50/50 via-amber-50/35 to-transparent shadow-[inset_0_0_0_1px_rgba(224,1,34,0.12)]",
                                  !attention && "hover:bg-slate-50/60"
                                )}
                              >
                                <td className="align-top px-3 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {attention ? (
                                      <span className="inline-flex items-center rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                                        Unfiled
                                      </span>
                                    ) : (
                                      <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
                                        Filed
                                      </span>
                                    )}
                                    {isNew ? (
                                      <span className="inline-flex items-center gap-0.5 rounded-md bg-[#E00122] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                                        <Sparkles className="h-3 w-3" aria-hidden />
                                        New
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-700">
                                  {submittedFmt.format(new Date(row.created_at))}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 text-gray-800">
                                  {row.date ?? "—"}
                                </td>
                                <td className="max-w-[180px] px-3 py-3">
                                  <div className="font-medium text-gray-900">{row.name}</div>
                                  <div className="truncate text-xs text-gray-500">{row.email}</div>
                                </td>
                                <td className="max-w-[160px] px-3 py-3">
                                  <div className="truncate text-gray-800">{row.vendor_name}</div>
                                  <div className="truncate text-xs text-gray-500">{row.m_number}</div>
                                </td>
                                <td className="max-w-[220px] px-3 py-3 align-top">
                                  {row.ic_competition ? (
                                    <div className="space-y-1">
                                      <span className="inline-flex rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-900">
                                        IC
                                      </span>
                                      {row.ic_participant_name ? (
                                        <div className="truncate text-xs text-gray-700">
                                          {row.ic_participant_name}
                                          {row.ic_participant_role ? (
                                            <span className="text-gray-500">
                                              {" "}
                                              — {row.ic_participant_role}
                                            </span>
                                          ) : null}
                                        </div>
                                      ) : null}
                                      {row.ic_participant_email ? (
                                        <div className="truncate text-xs text-gray-500">
                                          {row.ic_participant_email}
                                        </div>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 font-medium tabular-nums text-gray-900">
                                  {money.format(Number(row.amount))}
                                </td>
                                <td className="max-w-[120px] truncate px-3 py-3 text-gray-700">
                                  {row.reimbursement_type}
                                </td>
                                <td className="px-3 py-3">
                                  <div className="space-y-1">
                                    <span
                                      className={cn(
                                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                        row.budgeted
                                          ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100"
                                          : "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
                                      )}
                                    >
                                      {row.budgeted ? "Yes" : "No"}
                                    </span>
                                    {!row.budgeted ? (
                                      <div className="space-y-0.5">
                                        {row.non_budgeted_officer_name ? (
                                          <div className="truncate text-xs text-gray-700">
                                            {row.non_budgeted_officer_name}
                                            {row.non_budgeted_officer_position ? (
                                              <span className="text-gray-500">
                                                {" "}
                                                — {row.non_budgeted_officer_position}
                                              </span>
                                            ) : null}
                                          </div>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>
                                </td>
                                <td className="align-top px-3 py-3">
                                  <AttachmentActions
                                    url={row.itemized_receipt_url}
                                    suggestedFilename={
                                      row.itemized_receipt_filename ??
                                      `reimbursement-${row.id}-receipt`
                                    }
                                    kind="receipt"
                                  />
                                </td>
                                <td className="align-top px-3 py-3">
                                  <AttachmentActions
                                    url={row.supporting_document_url}
                                    suggestedFilename={
                                      row.supporting_document_filename ??
                                      `reimbursement-${row.id}-supporting`
                                    }
                                    kind="supporting"
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={row.filed}
                                      disabled={
                                        filedMutation.isPending &&
                                        filedMutation.variables?.id === row.id
                                      }
                                      onCheckedChange={(checked) =>
                                        filedMutation.mutate({ id: row.id, filed: checked })
                                      }
                                      className="data-[state=checked]:bg-[#E00122]"
                                    />
                                    <span className="text-xs text-gray-500">
                                      {row.filed ? "Filed" : "Pending"}
                                    </span>
                                  </div>
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
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
