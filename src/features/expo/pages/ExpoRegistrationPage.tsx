import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Gavel } from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Checkbox } from "@shared/ui/checkbox";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { formatErrorMessage } from "@shared/lib/formatError";
import { cn } from "@shared/lib/utils";
import { expoKeys } from "../queryKeys";
import { getJudges, setJudgeCheckedIn, type Judge } from "../services/ExpoRegistrationService";

type CheckInFilterType = "all" | "checked-in" | "not-checked-in";

const JUDGE_COLUMNS = [
  "Name",
  "Contact",
  "Employer",
  "Categories",
  "Timeslots",
  "Projects",
  "Lunch",
  "PIN",
  "Checked in",
];

function lunchLabel(judge: Judge): string {
  if (!judge.is_attending_lunch) return "Not attending";
  return judge.lunch_preference_display ?? "Attending";
}

function renderJudgeRows(
  isLoading: boolean,
  judges: Judge[],
  onToggle: (judge: Judge, checked: boolean) => void,
): ReactNode {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={JUDGE_COLUMNS.length} className="px-4 py-8 text-center text-gray-500">
          Loading judges…
        </td>
      </tr>
    );
  }
  if (judges.length === 0) {
    return (
      <tr>
        <td colSpan={JUDGE_COLUMNS.length} className="px-4 py-8 text-center text-gray-500">
          No judges match this search.
        </td>
      </tr>
    );
  }
  return judges.map((judge) => {
    const checkboxId = `judge-check-in-${judge.id}`;
    return (
      <tr
        key={judge.id}
        className={cn(
          "border-b border-gray-100 last:border-0 align-top",
          judge.has_checked_in
            ? "bg-emerald-50/60 hover:bg-emerald-50"
            : "bg-white hover:bg-gray-50/50"
        )}
      >
        <td className="px-4 py-3 text-gray-700">
          <div className="font-medium text-[#333333]">
            {judge.first_name} {judge.last_name}
          </div>
          {judge.is_backup_judge && (
            <span className="mt-1 inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700">
              Backup
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-gray-700">
          <div>{judge.email}</div>
          <div className="text-gray-500">{judge.phone_number}</div>
        </td>
        <td className="px-4 py-3 text-gray-700">{judge.employer_name}</td>
        <td className="px-4 py-3 text-gray-700">
          <ul className="space-y-0.5">
            {judge.judging_category_display.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </td>
        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
          <ul className="space-y-0.5">
            {judge.judging_timeslot_display.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
        </td>
        <td className="px-4 py-3 text-gray-700 tabular-nums">{judge.number_of_projects}</td>
        <td className="px-4 py-3 text-gray-700">
          <div>{lunchLabel(judge)}</div>
          {judge.dietary_restrictions && (
            <div className="text-gray-500">{judge.dietary_restrictions}</div>
          )}
        </td>
        <td className="px-4 py-3 font-mono text-gray-700">{judge.judge_pin}</td>
        <td className="px-4 py-3">
          <label htmlFor={checkboxId} className="inline-flex cursor-pointer items-center gap-2">
            <Checkbox
              id={checkboxId}
              checked={judge.has_checked_in}
              onCheckedChange={(checked) => onToggle(judge, checked === true)}
              aria-label={`Mark ${judge.first_name} ${judge.last_name} as checked in`}
            />
            <span
              className={cn(
                "text-sm",
                judge.has_checked_in ? "font-medium text-emerald-700" : "text-gray-500"
              )}
            >
              {judge.has_checked_in ? "Checked in" : "Not yet"}
            </span>
          </label>
        </td>
      </tr>
    );
  });
}

export default function ExpoRegistrationPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [checkInFilter, setCheckInFilter] = useState<CheckInFilterType>("all");
  const [toggleError, setToggleError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const judgesQuery = useQuery({
    queryKey: expoKeys.judgesWithSearch(debouncedSearch),
    queryFn: () => getJudges(debouncedSearch || undefined),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  const checkInMutation = useMutation({
    mutationFn: ({ id, hasCheckedIn }: { id: string; hasCheckedIn: boolean }) =>
      setJudgeCheckedIn(id, hasCheckedIn),
    onMutate: async ({ id, hasCheckedIn }) => {
      setToggleError(null);
      await queryClient.cancelQueries({ queryKey: expoKeys.judges });
      const previous = queryClient.getQueriesData<Judge[]>({ queryKey: expoKeys.judges });
      queryClient.setQueriesData<Judge[]>({ queryKey: expoKeys.judges }, (old) =>
        old?.map((judge) =>
          judge.id === id ? { ...judge, has_checked_in: hasCheckedIn } : judge
        )
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      setToggleError(formatErrorMessage(err));
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: expoKeys.judges });
    },
  });

  const judges = useMemo(() => judgesQuery.data ?? [], [judgesQuery.data]);
  const checkedInCount = judges.filter((judge) => judge.has_checked_in).length;
  const visibleJudges = judges.filter((judge) => {
    if (checkInFilter === "checked-in") return judge.has_checked_in;
    if (checkInFilter === "not-checked-in") return !judge.has_checked_in;
    return true;
  });

  const listError =
    judgesQuery.isError && judgesQuery.error ? formatErrorMessage(judgesQuery.error) : null;
  const errorMessage = toggleError ?? listError;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#E00122] hover:underline mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Link>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 text-[#E00122]">
                    <Gavel className="h-6 w-6" />
                    <CardTitle className="text-2xl">EXPO Registration</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    View registered judges and mark them as checked in when they arrive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Judges
                    </h3>
                    <p className="text-sm text-gray-600 tabular-nums">
                      {checkedInCount} of {judges.length} checked in
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="w-full max-w-md space-y-2">
                      <Label htmlFor="judge-search">Search judges</Label>
                      <Input
                        id="judge-search"
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Name, email, phone, or employer…"
                        className="border-gray-200"
                      />
                    </div>

                    <div className="w-full max-w-xs space-y-2">
                      <Label htmlFor="check-in-filter">Filter by check-in</Label>
                      <Select
                        value={checkInFilter}
                        onValueChange={(value) => setCheckInFilter(value as CheckInFilterType)}
                      >
                        <SelectTrigger id="check-in-filter" className="w-full border-gray-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="checked-in">Checked in</SelectItem>
                          <SelectItem value="not-checked-in">Not checked in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-600" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <div className="max-h-[min(70vh,640px)] overflow-auto rounded-lg border border-gray-200">
                    <table className="w-full min-w-[1100px] text-sm">
                      <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                        <tr className="border-b border-gray-200">
                          {JUDGE_COLUMNS.map((column) => (
                            <th
                              key={column}
                              className="px-4 py-3 text-left font-semibold text-[#333333] whitespace-nowrap"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {renderJudgeRows(
                          judgesQuery.isLoading,
                          visibleJudges,
                          (judge, checked) =>
                            checkInMutation.mutate({ id: judge.id, hasCheckedIn: checked })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
