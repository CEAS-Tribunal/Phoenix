import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  LayoutList,
  Trash2,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Switch } from "@shared/ui/switch";
import { cn } from "@shared/lib/utils";
import { formatErrorMessage } from "@shared/lib/formatError";
import {
  createOrgFundingDate,
  deleteOrgFundingDate,
  listAllOrgFundingDates,
  updateOrgFundingDate,
  type OrgFundingDate,
} from "../services/orgFundingService";
import { orgFundingKeys } from "../queryKeys";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

function DateRow({ date }: { date: OrgFundingDate }) {
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: orgFundingKeys.dates() });

  const toggleMutation = useMutation({
    mutationFn: (is_open: boolean) => updateOrgFundingDate(date.id, { is_open }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrgFundingDate(date.id),
    onSuccess: invalidate,
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        date.is_open ? "border-gray-200 bg-white" : "border-gray-200 bg-slate-50"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#E00122]" />
          <p className="font-medium text-gray-900">{formatDateLabel(date.date)}</p>
          {!date.is_open ? (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
              Closed
            </span>
          ) : null}
        </div>
        {date.label ? (
          <p className="mt-1 text-sm text-gray-700">{date.label}</p>
        ) : null}
        {date.notes ? (
          <p className="mt-1 text-xs text-gray-500">{date.notes}</p>
        ) : null}
        <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-gray-500">
          {date.capacity != null ? <span>Capacity: {date.capacity}</span> : null}
          {date.requests_count != null ? (
            <span>{date.requests_count} request(s)</span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={date.is_open}
            disabled={toggleMutation.isPending}
            onCheckedChange={(checked) => toggleMutation.mutate(checked)}
            className="data-[state=checked]:bg-[#E00122]"
            aria-label={date.is_open ? "Close date" : "Open date"}
          />
          <span className="text-xs text-gray-500">
            {date.is_open ? "Open" : "Closed"}
          </span>
        </div>
        {confirmingDelete ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-gray-200"
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 bg-rose-600 text-white hover:bg-rose-700"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-gray-400 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete date"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminOrgFundingDatesPage() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [capacity, setCapacity] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const datesQuery = useQuery({
    queryKey: orgFundingKeys.allDates(),
    queryFn: listAllOrgFundingDates,
  });

  const createMutation = useMutation({
    mutationFn: createOrgFundingDate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orgFundingKeys.dates() });
      setDate("");
      setLabel("");
      setNotes("");
      setCapacity("");
      setClientError(null);
    },
  });

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    setClientError(null);
    createMutation.reset();
    if (!date) {
      setClientError("Please choose a date.");
      return;
    }
    let capacityValue: number | null = null;
    if (capacity.trim()) {
      const parsed = Number.parseInt(capacity, 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        setClientError("Capacity must be a non-negative number.");
        return;
      }
      capacityValue = parsed;
    }
    createMutation.mutate({
      date,
      label: label.trim(),
      notes: notes.trim() || undefined,
      capacity: capacityValue,
      is_open: true,
    });
  }

  const dates = datesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  to="/admin/org-funding"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                >
                  <LayoutList className="h-4 w-4" />
                  Org funding submissions
                </Link>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-[#E00122]">
                  <CalendarDays className="h-6 w-6" />
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Available funding dates
                  </h1>
                </div>
                <p className="mt-1 max-w-3xl text-sm text-gray-600">
                  Open dates appear on the public funding form for organizations to select. Toggle
                  a date closed to hide it without deleting it.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                {/* Existing dates */}
                <div className="space-y-3">
                  {datesQuery.isLoading ? (
                    <p className="rounded-xl border border-gray-200 px-4 py-12 text-center text-sm text-gray-500">
                      Loading dates…
                    </p>
                  ) : datesQuery.isError ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-12 text-center text-sm text-rose-700">
                      {formatErrorMessage(datesQuery.error)}
                    </p>
                  ) : dates.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 px-4 py-12 text-center text-sm text-gray-400">
                      No dates yet. Add one on the right to make it available on the funding form.
                    </p>
                  ) : (
                    dates.map((d) => <DateRow key={d.id} date={d} />)
                  )}
                </div>

                {/* Add date */}
                <Card className="h-fit border-gray-200 shadow-sm lg:sticky lg:top-24">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-[#E00122]">
                      <CalendarPlus className="h-5 w-5" />
                      <CardTitle className="text-lg">Add a date</CardTitle>
                    </div>
                    <CardDescription>
                      New dates are open by default.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-date">Date</Label>
                        <Input
                          id="new-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-label">Label</Label>
                        <Input
                          id="new-label"
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          placeholder="e.g. Spring cycle presentations"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-notes">Notes (optional)</Label>
                        <textarea
                          id="new-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          placeholder="Anything orgs should know about this date."
                          className="w-full rounded-md border border-gray-200 p-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/25"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-capacity">Capacity (optional)</Label>
                        <Input
                          id="new-capacity"
                          type="number"
                          min="0"
                          step="1"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          placeholder="Max requests for this date"
                          className="border-gray-200"
                        />
                      </div>

                      {clientError || createMutation.isError ? (
                        <p className="text-sm text-red-600" role="alert">
                          {clientError ?? formatErrorMessage(createMutation.error)}
                        </p>
                      ) : null}

                      <Button
                        type="submit"
                        className="w-full bg-[#E00122] text-white hover:bg-[#B8011C]"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? "Adding…" : "Add date"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
