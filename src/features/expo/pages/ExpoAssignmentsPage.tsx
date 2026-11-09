import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, CalendarClock, Loader2, Wand2 } from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { formatErrorMessage } from "@shared/lib/formatError";
import { cn } from "@shared/lib/utils";
import { expoKeys } from "../queryKeys";
import {
  generateAssignments,
  getAssignments,
  getJudges,
  getTeams,
  type AssignmentShortfall,
  type JudgeAssignment,
} from "../services/ExpoRegistrationService";

const TIMESLOTS = [
  { key: "1", label: "9:30" },
  { key: "2", label: "9:50" },
  { key: "3", label: "10:10" },
  { key: "4", label: "10:30" },
  { key: "5", label: "10:50" },
  { key: "6", label: "11:10" },
  { key: "7", label: "11:30" },
  { key: "8", label: "11:50" },
  { key: "9", label: "12:10" },
  { key: "10", label: "12:30" },
];

function parseJudgeCount(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : null;
}

function ScheduleTable({
  rowHeader,
  rows,
}: {
  rowHeader: string;
  rows: {
    id: string;
    title: string;
    subtitle: string;
    count: number;
    warn: boolean;
    cells: Record<string, { text: string; muted?: boolean } | undefined>;
    unavailable?: Set<string>;
  }[];
}) {
  return (
    <div className="max-h-[min(70vh,640px)] overflow-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-[#333333] whitespace-nowrap">
              {rowHeader}
            </th>
            <th className="px-3 py-3 text-left font-semibold text-[#333333]">#</th>
            {TIMESLOTS.map((slot) => (
              <th
                key={slot.key}
                className="px-3 py-3 text-left font-semibold text-[#333333] whitespace-nowrap tabular-nums"
              >
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={TIMESLOTS.length + 2} className="px-4 py-8 text-center text-gray-500">
                Nothing to show yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-gray-100 last:border-0 align-top",
                  row.warn ? "bg-amber-50/70" : "bg-white hover:bg-gray-50/50"
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[#333333]">{row.title}</div>
                  <div className="text-xs text-gray-500">{row.subtitle}</div>
                </td>
                <td
                  className={cn(
                    "px-3 py-3 tabular-nums",
                    row.warn ? "font-semibold text-amber-700" : "text-gray-700"
                  )}
                >
                  {row.count}
                </td>
                {TIMESLOTS.map((slot) => {
                  const cell = row.cells[slot.key];
                  const unavailable = row.unavailable?.has(slot.key);
                  return (
                    <td
                      key={slot.key}
                      className={cn("px-3 py-3", unavailable && "bg-gray-100/80")}
                    >
                      {cell && (
                        <span
                          className={cn(
                            "inline-block rounded px-1.5 py-0.5 text-xs font-medium",
                            cell.muted
                              ? "bg-gray-200 text-gray-700"
                              : "bg-[#E00122]/10 text-[#B8011C]"
                          )}
                        >
                          {cell.text}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ExpoAssignmentsPage() {
  const queryClient = useQueryClient();
  const [minInput, setMinInput] = useState("3");
  const [maxInput, setMaxInput] = useState("");
  const [shortfalls, setShortfalls] = useState<AssignmentShortfall[] | null>(null);
  const [view, setView] = useState("teams");

  const teamsQuery = useQuery({ queryKey: expoKeys.teams, queryFn: getTeams });
  const judgesQuery = useQuery({ queryKey: expoKeys.judges, queryFn: () => getJudges() });
  const assignmentsQuery = useQuery({ queryKey: expoKeys.assignments, queryFn: getAssignments });

  const minJudges = parseJudgeCount(minInput);
  const maxJudges = maxInput.trim() === "" ? null : parseJudgeCount(maxInput);
  const paramsValid =
    minJudges !== null &&
    (maxInput.trim() === "" || (maxJudges !== null && maxJudges >= minJudges));

  const generateMutation = useMutation({
    mutationFn: () => generateAssignments(minJudges ?? 3, maxJudges),
    onSuccess: (data) => {
      queryClient.setQueryData(expoKeys.assignments, data.assignments);
      setShortfalls(data.shortfalls);
    },
  });

  const teams = useMemo(() => teamsQuery.data ?? [], [teamsQuery.data]);
  const judges = useMemo(() => judgesQuery.data ?? [], [judgesQuery.data]);
  const assignments = useMemo(() => assignmentsQuery.data ?? [], [assignmentsQuery.data]);
  const required = minJudges ?? 3;

  const byTeam = useMemo(() => groupBy(assignments, (a) => a.student), [assignments]);
  const byJudge = useMemo(() => groupBy(assignments, (a) => a.judge), [assignments]);

  const teamRows = teams.map((team) => {
    const mine = byTeam.get(team.id) ?? [];
    return {
      id: team.id,
      title: team.team_name,
      subtitle: `Booth ${team.booth_number} · ${team.team_category_display}`,
      count: mine.length,
      warn: mine.length < required,
      cells: Object.fromEntries(
        mine.map((a) => [a.timeslot, { text: a.judge_name, muted: a.is_backup_judge }])
      ),
    };
  });

  const judgeRows = judges
    .filter((judge) => !judge.is_backup_judge || byJudge.has(judge.id))
    .map((judge) => {
      const mine = byJudge.get(judge.id) ?? [];
      const available = new Set(judge.judging_timeslot);
      return {
        id: judge.id,
        title: `${judge.first_name} ${judge.last_name}`,
        subtitle: `${judge.is_backup_judge ? "Backup · " : ""}up to ${judge.number_of_projects} projects`,
        count: mine.length,
        warn: false,
        cells: Object.fromEntries(
          mine.map((a) => [a.timeslot, { text: `${a.team_name} (#${a.booth_number})` }])
        ),
        unavailable: new Set(TIMESLOTS.map((s) => s.key).filter((key) => !available.has(key))),
      };
    });

  const underCovered = teamRows.filter((row) => row.warn);
  const shortfallReasons = new Map((shortfalls ?? []).map((s) => [s.student_id, s.reason]));

  const handleGenerate = () => {
    if (
      assignments.length > 0 &&
      !window.confirm("This will replace the current judge schedule. Continue?")
    ) {
      return;
    }
    generateMutation.mutate();
  };

  const loadError = [teamsQuery, judgesQuery, assignmentsQuery].find((q) => q.isError)?.error;
  const errorMessage = generateMutation.isError
    ? formatErrorMessage(generateMutation.error)
    : loadError
      ? formatErrorMessage(loadError)
      : null;
  const isLoading = teamsQuery.isLoading || judgesQuery.isLoading || assignmentsQuery.isLoading;

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
                    <CalendarClock className="h-6 w-6" />
                    <CardTitle className="text-2xl">EXPO Judge Assignments</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Generate a judging schedule. Judges are only placed in timeslots they signed up
                    for and categories they selected, and each team&apos;s judges come at different,
                    spread-out times. Backup judges are not auto-assigned.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="w-32 space-y-2">
                      <Label htmlFor="min-judges">Min judges / team</Label>
                      <Input
                        id="min-judges"
                        type="number"
                        min={1}
                        max={10}
                        value={minInput}
                        onChange={(e) => setMinInput(e.target.value)}
                        className="border-gray-200"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label htmlFor="max-judges">Max judges / team</Label>
                      <Input
                        id="max-judges"
                        type="number"
                        min={1}
                        max={10}
                        value={maxInput}
                        onChange={(e) => setMaxInput(e.target.value)}
                        placeholder="Same as min"
                        className="border-gray-200"
                      />
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={!paramsValid || generateMutation.isPending || isLoading}
                      className="bg-[#E00122] hover:bg-[#B8011C] rounded-md"
                    >
                      {generateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {generateMutation.isPending ? "Generating…" : "Generate assignments"}
                    </Button>
                    <p className="ml-auto text-sm text-gray-600 tabular-nums">
                      {assignments.length} assignments · {teams.length} teams ·{" "}
                      {underCovered.length} under {required} judges
                    </p>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-600" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  {!isLoading && assignments.length > 0 && underCovered.length > 0 && (
                    <div
                      className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                      role="status"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4" />
                        {underCovered.length} team{underCovered.length === 1 ? "" : "s"} below{" "}
                        {required} judges
                      </div>
                      <ul className="mt-2 space-y-0.5">
                        {underCovered.map((row) => (
                          <li key={row.id}>
                            <span className="font-medium">{row.title}</span> ({row.count}/
                            {required})
                            {shortfallReasons.get(row.id) && ` — ${shortfallReasons.get(row.id)}`}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-amber-800">
                        Recruit more judges in these categories, or add backup judges manually.
                      </p>
                    </div>
                  )}

                  {isLoading ? (
                    <p className="py-8 text-center text-gray-500">Loading schedule…</p>
                  ) : (
                    <Tabs value={view} onValueChange={setView}>
                      <TabsList>
                        <TabsTrigger value="teams">By team</TabsTrigger>
                        <TabsTrigger value="judges">By judge</TabsTrigger>
                      </TabsList>
                      <TabsContent value="teams">
                        <ScheduleTable rowHeader="Team" rows={teamRows} />
                      </TabsContent>
                      <TabsContent value="judges">
                        <ScheduleTable rowHeader="Judge" rows={judgeRows} />
                        <p className="mt-2 text-xs text-gray-500">
                          Shaded cells are timeslots the judge did not sign up for.
                        </p>
                      </TabsContent>
                    </Tabs>
                  )}
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

function groupBy(
  items: JudgeAssignment[],
  key: (item: JudgeAssignment) => string
): Map<string, JudgeAssignment[]> {
  const map = new Map<string, JudgeAssignment[]>();
  for (const item of items) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}
