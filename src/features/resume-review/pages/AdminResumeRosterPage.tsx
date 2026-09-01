import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ClipboardList,
  Download,
  GraduationCap,
  University,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Switch } from "@shared/ui/switch";
import { formatErrorMessage } from "@shared/lib/formatError";
import { isAuthenticated } from "@auth";
import { ResumeReviewDay, type RosterEmployer } from "../services/resumeReviewService";
import { rrdKeys } from "../queryKeys";

function slotsTaken(emp: RosterEmployer): { taken: number; total: number } {
  const total = emp.slots.length;
  const taken = emp.slots.filter((s) => s.student !== null).length;
  return { taken, total };
}

export default function AdminResumeRosterPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  const rosterQuery = useQuery({
    queryKey: rrdKeys.roster,
    queryFn: () => ResumeReviewDay.getRoster(),
    enabled: isAuthenticated(),
  });

  const settingsQuery = useQuery({
    queryKey: rrdKeys.settings,
    queryFn: () => ResumeReviewDay.getSettings(),
  });

  const settingsMutation = useMutation({
    mutationFn: (settings: Parameters<typeof ResumeReviewDay.updateSettings>[0]) =>
      ResumeReviewDay.updateSettings(settings),
    onSuccess: (settings) => {
      queryClient.setQueryData(rrdKeys.settings, settings);
    },
  });

  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadMutation = useMutation({
    mutationFn: () => ResumeReviewDay.downloadResumesZip(),
    onMutate: () => setDownloadError(null),
    onError: (error) => setDownloadError(formatErrorMessage(error)),
  });

  const filtered = useMemo(() => {
    const rows = rosterQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (e) =>
        e.company_name.toLowerCase().includes(q) ||
        e.full_name.toLowerCase().includes(q)
    );
  }, [rosterQuery.data, search]);

  const errorMessage =
    rosterQuery.isError && rosterQuery.error
      ? formatErrorMessage(rosterQuery.error)
      : null;

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

              <div className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[#E00122] mb-2">
                      <ClipboardList className="h-8 w-8" />
                      <h1 className="text-3xl font-bold tracking-tight text-[#333333]">
                        Resume Review Day Roster
                      </h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl">
                      Employers registered for Resume Review Day, their time windows, and
                      which students claimed each 20-minute slot.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0 bg-[#E00122] hover:bg-[#c0011e] text-white"
                    disabled={downloadMutation.isPending || rosterQuery.isPending}
                    onClick={() => downloadMutation.mutate()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {downloadMutation.isPending ? "Preparing zip…" : "Download all resumes"}
                  </Button>
                </div>
                <div className="mt-5 flex flex-wrap gap-5">
                  <div className="flex items-center gap-2">
                    <University className="h-4 w-4 text-[#E00122]" />
                    <span className="text-sm font-medium text-gray-800">Employer page</span>
                    <Switch
                      checked={settingsQuery.data?.employer_page_open ?? false}
                      disabled={settingsQuery.isPending || settingsMutation.isPending}
                      onCheckedChange={(checked) =>
                        settingsMutation.mutate({ employer_page_open: checked })
                      }
                      className="data-[state=checked]:bg-[#E00122]"
                      aria-label="Toggle employer registration page"
                    />
                    <span className="text-xs text-gray-500">
                      {settingsQuery.data?.employer_page_open ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#E00122]" />
                    <span className="text-sm font-medium text-gray-800">Student page</span>
                    <Switch
                      checked={settingsQuery.data?.student_page_open ?? false}
                      disabled={settingsQuery.isPending || settingsMutation.isPending}
                      onCheckedChange={(checked) =>
                        settingsMutation.mutate({ student_page_open: checked })
                      }
                      className="data-[state=checked]:bg-[#E00122]"
                      aria-label="Toggle student registration page"
                    />
                    <span className="text-xs text-gray-500">
                      {settingsQuery.data?.student_page_open ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-md space-y-2 mb-8">
                <Label htmlFor="roster-search">Filter by company or employer name</Label>
                <Input
                  id="roster-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="border-gray-200"
                  autoComplete="off"
                />
              </div>

              {(errorMessage || downloadError) && (
                <p className="mb-6 text-sm text-red-600" role="alert">
                  {errorMessage ?? downloadError}
                </p>
              )}

              {rosterQuery.isPending && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-gray-200 overflow-hidden">
                      <div className="p-6 animate-pulse space-y-3">
                        <div className="h-6 w-1/3 rounded bg-gray-200" />
                        <div className="h-4 w-1/4 rounded bg-gray-100" />
                        <div className="h-4 w-1/2 rounded bg-gray-100" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!rosterQuery.isPending && filtered.length === 0 && (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center text-gray-600">
                    {search.trim()
                      ? "No employers match your search."
                      : "No employers registered for Resume Review Day yet."}
                  </CardContent>
                </Card>
              )}

              {!rosterQuery.isPending && filtered.length > 0 && (
                <div className="space-y-4">
                  {filtered.map((emp) => {
                    const { taken, total } = slotsTaken(emp);
                    const isOpen = !!expanded[emp.id];
                    return (
                      <Card key={emp.id} className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="min-w-0">
                              <CardTitle className="text-xl text-[#333333]">
                                {emp.company_name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 mt-1">
                                {emp.full_name} · {emp.email}
                              </CardDescription>
                              <p className="text-sm text-gray-600 mt-2">
                                Window: {emp.start_time} – {emp.end_time} · Max resumes:{" "}
                                {emp.max_resumes}
                              </p>
                              <p className="text-sm font-medium text-[#333333] mt-1">
                                {taken} / {total} slots taken
                              </p>
                              {emp.selected_majors.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {emp.selected_majors.map((m) => (
                                    <span
                                      key={m}
                                      className="inline-flex rounded-full border border-gray-200 bg-[#F9FAFB] px-2 py-0.5 text-xs text-gray-700"
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="shrink-0 border-gray-200"
                              onClick={() => toggleExpanded(emp.id)}
                              aria-expanded={isOpen}
                            >
                              {isOpen ? "Hide" : "Show"} timeslots
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </div>
                        </CardHeader>
                        {isOpen && (
                          <CardContent className="pt-0">
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                              <table className="w-full min-w-140 text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                                      Time
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                                      Student
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                                      Major
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                                      Grad year
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {emp.slots.map((slot) => (
                                    <tr
                                      key={slot.slot_id}
                                      className="border-b border-gray-100 last:border-0"
                                    >
                                      <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                        {slot.time}
                                      </td>
                                      <td className="px-4 py-3 text-gray-700">
                                        {slot.student ? (
                                          <>
                                            <span className="font-medium">
                                              {slot.student.full_name}
                                            </span>
                                            <br />
                                            <a
                                              href={`mailto:${slot.student.email}`}
                                              className="text-xs text-[#E00122] hover:underline"
                                            >
                                              {slot.student.email}
                                            </a>
                                          </>
                                        ) : (
                                          <span className="text-gray-500 italic">
                                            — Available —
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-gray-700">
                                        {slot.student?.major ?? "—"}
                                      </td>
                                      <td className="px-4 py-3 text-gray-700">
                                        {slot.student?.grad_year ?? "—"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
