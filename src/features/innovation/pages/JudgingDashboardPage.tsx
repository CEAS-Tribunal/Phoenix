import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, CircleCheckBig, Users } from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Label } from "@shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/select";
import { formatErrorMessage } from "@shared/lib/formatError";
import { innovationKeys } from "../queryKeys";
import {
    listInnovationResults,
    listInnovationRooms,
    listInnovationSubmissions,
    listJudges,
    listTeams,
    type InnovationResult,
} from "../services/innovationService";

type RankingMetric = "overall" | "raw";

const rubricCriteria = [
    { id: "presentation-quality", title: "Presentation Quality" },
    { id: "business-model-clarity", title: "Business Model Clarity" },
    { id: "value-proposition", title: "Value Proposition" },
    { id: "competitive-analysis", title: "Competitive Analysis" },
    { id: "market-analysis", title: "Market Analysis" },
    { id: "product-prototype-understanding", title: "Product/Prototype Understanding" },
    { id: "growth", title: "Growth" },
    { id: "qa-effectiveness", title: "Q&A Effectiveness" },
    { id: "overall-rating", title: "Overall Rating" },
];

function formatScore(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }
    const score = Number(value);
    return Number.isFinite(score) ? score.toFixed(1) : "—";
}

function formatCorrection(value: number): string {
    if (!Number.isFinite(value)) {
        return "—";
    }
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

function getNumericScore(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    const score = Number(value);
    return Number.isFinite(score) ? score : null;
}

function getAverageRawScore(scores: Record<string, number>): number | null {
    const ratings = rubricCriteria
        .map((criterion) => getNumericScore(scores[criterion.id]))
        .filter((score): score is number => score !== null && score >= 1 && score <= 10);
    if (ratings.length === 0) {
        return null;
    }
    return ratings.reduce((total, score) => total + score, 0) / ratings.length;
}

function getRankingScore(
    result: InnovationResult | undefined,
    metric: RankingMetric
): number | null {
    return getNumericScore(
        metric === "raw" ? result?.average_score : result?.average_corrected_score
    );
}

export default function JudgingDashboardPage() {
    const [selectedJudge, setSelectedJudge] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState("all");
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
    const [rankingMetric, setRankingMetric] = useState<RankingMetric>("overall");

    const judgesQuery = useQuery({
        queryKey: innovationKeys.judges(),
        queryFn: listJudges,
    });
    const roomsQuery = useQuery({
        queryKey: innovationKeys.rooms(),
        queryFn: listInnovationRooms,
    });
    const teamsQuery = useQuery({
        queryKey: innovationKeys.teams(),
        queryFn: listTeams,
    });
    const resultsFilters = {
        ...(selectedJudge !== "all" ? { judge_id: Number(selectedJudge) } : {}),
        ...(selectedRoom !== "all" ? { room: selectedRoom } : {}),
    };
    const resultsQuery = useQuery({
        queryKey: innovationKeys.results(resultsFilters),
        queryFn: () => listInnovationResults(resultsFilters),
    });
    const submissionsQuery = useQuery({
        queryKey: innovationKeys.submissions(),
        queryFn: () => listInnovationSubmissions(),
    });

    const submissions = submissionsQuery.data ?? [];
    const activeRoomValues = new Set(
        (roomsQuery.data ?? []).map((room) => room.value)
    );
    const visibleJudges = (judgesQuery.data ?? []).filter(
        (judge) => judge.is_active && activeRoomValues.has(judge.room)
    );
    const visibleJudgeIds = new Set(visibleJudges.map((judge) => judge.id));
    const totalActiveTeamCount = (teamsQuery.data ?? []).filter(
        (team) => team.is_active && activeRoomValues.has(team.room)
    ).length;
    const teamsWithSelectedJudgeSubmissions =
        selectedJudge === "all"
            ? null
            : new Set(
                submissions
                    .filter(
                        (submission) =>
                            submission.judge_id === Number(selectedJudge)
                    )
                    .map((submission) => submission.team_id)
            );
    const activeTeams = (teamsQuery.data ?? [])
        .filter((team) => team.is_active)
        .filter((team) => activeRoomValues.has(team.room))
        .filter((team) => selectedRoom === "all" || team.room === selectedRoom)
        .filter(
            (team) =>
                teamsWithSelectedJudgeSubmissions === null ||
                teamsWithSelectedJudgeSubmissions.has(team.id)
        );
    const resultsByTeam = new Map(
        (resultsQuery.data ?? []).map((result) => [result.team_id, result])
    );
    const roomFilterOptions = roomsQuery.data ?? [];
    const visibleResults = activeTeams
        .map((team) => ({
            team,
            result: resultsByTeam.get(team.id),
        }))
        .sort(
            (a, b) =>
                (getRankingScore(b.result, rankingMetric) ?? -Infinity) -
                (getRankingScore(a.result, rankingMetric) ?? -Infinity) ||
                a.team.name.localeCompare(b.team.name)
        );
    const scoredTeams = visibleResults.filter(
        ({ result }) => getRankingScore(result, rankingMetric) !== null
    );
    const rankingLabel =
        rankingMetric === "raw" ? "Average Raw Score" : "Average Overall Score";
    const podium = [
        {
            place: "1st Place",
            rankedTeam: scoredTeams[0],
            className:
                "border-amber-200/90 bg-linear-to-br from-amber-50 to-yellow-50/80 text-amber-950",
            labelClassName: "text-amber-900/80",
        },
        {
            place: "2nd Place",
            rankedTeam: scoredTeams[1],
            className:
                "border-gray-200 bg-linear-to-br from-gray-50 to-slate-100/90 text-gray-900",
            labelClassName: "text-gray-600",
        },
        {
            place: "3rd Place",
            rankedTeam: scoredTeams[2],
            className:
                "border-orange-200/90 bg-linear-to-br from-orange-50 to-amber-100/70 text-orange-950",
            labelClassName: "text-orange-900/80",
        },
    ];
    const topTeamCount = Math.ceil(scoredTeams.length / 4);
    const topTeamIds = new Set(
        scoredTeams.slice(0, topTeamCount).map(({ team }) => team.id)
    );
    const isLoading =
        teamsQuery.isPending ||
        judgesQuery.isPending ||
        roomsQuery.isPending ||
        resultsQuery.isPending ||
        submissionsQuery.isPending;
    const expandedSubmissions = submissions
        .filter(
            (submission) =>
                submission.team_id === expandedTeamId &&
                visibleJudgeIds.has(submission.judge_id) &&
                (selectedJudge === "all" ||
                    submission.judge_id === Number(selectedJudge))
        )
        .sort((a, b) => a.judge_name.localeCompare(b.judge_name));

    useEffect(() => {
        if (!roomsQuery.isSuccess) {
            return;
        }
        const availableRooms = new Set(roomsQuery.data.map((room) => room.value));
        if (
            selectedJudge !== "all" &&
            !judgesQuery.data?.some(
                (judge) =>
                    String(judge.id) === selectedJudge &&
                    availableRooms.has(judge.room)
            )
        ) {
            setSelectedJudge("all");
        }
        if (selectedRoom !== "all" && !availableRooms.has(selectedRoom)) {
            setSelectedRoom("all");
        }
        setExpandedTeamId((current) =>
            current === null ||
            teamsQuery.data?.some(
                (team) => team.id === current && availableRooms.has(team.room)
            )
                ? current
                : null
        );
    }, [
        judgesQuery.data,
        roomsQuery.data,
        roomsQuery.isSuccess,
        selectedJudge,
        selectedRoom,
        teamsQuery.data,
    ]);

    function toggleTeam(teamId: number) {
        setExpandedTeamId((current) => (current === teamId ? null : teamId));
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="min-h-screen bg-white">
                <section className="bg-linear-to-b from-slate-50 to-white py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-6xl"
                        >
                            <div className="items-center gap-2 text-center text-sm font-semibold uppercase tracking-wide text-[#E00122]">
                                Innovation Challenge
                            </div>
                            <h1 className="mt-3 text-center text-4xl font-bold tracking-tight text-[#333333] sm:text-5xl">
                                Final Competition Judging Dashboard
                            </h1>
                            <p className="mt-4 text-center text-base leading-relaxed text-gray-600">
                                View judging results and team scores for the Innovation Challenge Final Competition.
                            </p>
                        </motion.div>
                    </div>
                </section>
                <section className="bg-[#F9FAFB] py-8 lg:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                                    to="/admin/innovation/manage-judging"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                                >
                                    <Users className="h-4 w-4" />
                                    Manage Judges and Teams
                                </Link>
                            </div>
                            {!isLoading && scoredTeams.length > 0 ? (
                                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                                    {podium.map(({ place, rankedTeam, className, labelClassName }) => (
                                        <div
                                            key={place}
                                            className={`rounded-xl border px-4 py-3 shadow-sm ${className}`}
                                        >
                                            <p className={`text-xs font-semibold uppercase tracking-wide ${labelClassName}`}>
                                                {place}
                                            </p>
                                            <p className="mt-1 truncate text-2xl font-bold">
                                                {rankedTeam?.team.name ?? "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                                    <div className="flex items-center gap-3 text-[#E00122]">
                                        <CircleCheckBig className="h-6 w-6" />
                                        <CardTitle className="text-xl">Final Competition Scoring</CardTitle>
                                    </div>
                                    <div
                                        className="inline-flex rounded-full border border-gray-200 bg-white p-0.5 shadow-sm"
                                        role="group"
                                        aria-label="Choose team ranking score"
                                    >
                                        {([
                                            ["overall", "Overall"],
                                            ["raw", "Raw"],
                                        ] as const).map(([metric, label]) => (
                                            <button
                                                key={metric}
                                                type="button"
                                                aria-label={`Rank by average ${metric === "raw" ? "raw" : "overall"} score`}
                                                aria-pressed={rankingMetric === metric}
                                                onClick={() => setRankingMetric(metric)}
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                    rankingMetric === metric
                                                        ? "bg-[#E00122] text-white shadow-sm"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <div className="mb-5 grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="filter-judge">Filter by judge</Label>
                                                <Select
                                                    value={selectedJudge}
                                                    onValueChange={(value) => {
                                                        setSelectedJudge(value);
                                                        setExpandedTeamId(null);
                                                    }}
                                                    disabled={judgesQuery.isPending || judgesQuery.isError}
                                                >
                                                    <SelectTrigger
                                                        id="filter-judge"
                                                        className="w-full border-gray-300 bg-white focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                    >
                                                        <SelectValue placeholder="All judges" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300">
                                                        <SelectItem value="all">All judges</SelectItem>
                                                        {visibleJudges.map((judge) => (
                                                                <SelectItem key={judge.id} value={String(judge.id)}>
                                                                    {judge.name}
                                                                </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {judgesQuery.isError ? (
                                                    <p role="alert" className="text-sm text-red-600">
                                                        Could not load judges: {formatErrorMessage(judgesQuery.error)}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="filter-room">Filter by room</Label>
                                                <Select
                                                    value={selectedRoom}
                                                    onValueChange={(value) => {
                                                        setSelectedRoom(value);
                                                        setExpandedTeamId(null);
                                                    }}
                                                    disabled={roomsQuery.isPending || roomsQuery.isError}
                                                >
                                                    <SelectTrigger
                                                        id="filter-room"
                                                        className="w-full border-gray-300 bg-white focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                    >
                                                        <SelectValue placeholder="All rooms" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300">
                                                        <SelectItem value="all">All rooms</SelectItem>
                                                        {roomFilterOptions.map((room) => (
                                                            <SelectItem key={room.value} value={room.value}>
                                                                {room.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {roomsQuery.isError ? (
                                                    <p role="alert" className="text-sm text-red-600">
                                                        Could not load rooms: {formatErrorMessage(roomsQuery.error)}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                        {teamsQuery.isError ? (
                                            <p role="alert" className="mb-4 text-sm text-red-600">
                                                Could not load teams: {formatErrorMessage(teamsQuery.error)}
                                            </p>
                                        ) : null}
                                        {resultsQuery.isError ? (
                                            <p role="alert" className="mb-4 text-sm text-red-600">
                                                Could not load judging results: {formatErrorMessage(resultsQuery.error)}
                                            </p>
                                        ) : null}
                                        {submissionsQuery.isError ? (
                                            <p role="alert" className="mb-4 text-sm text-red-600">
                                                Could not load judge rubric details: {formatErrorMessage(submissionsQuery.error)}
                                            </p>
                                        ) : null}
                                        <div className="max-h-[min(85vh,720px)] overflow-auto rounded-lg border border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                            <table className="w-full min-w-[820px] table-fixed text-sm">
                                                <colgroup>
                                                    <col className="w-[26%]" />
                                                    <col className="w-[28%]" />
                                                    <col className="w-[23%]" />
                                                    <col className="w-[15%]" />
                                                    <col className="w-[8%]" />
                                                </colgroup>
                                                <thead className="sticky top-0 z-10 bg-[#E00122] shadow-sm">
                                                    <tr className="border-b border-[#B8011C]">
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Team Name
                                                        </th>
                                                        <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-white">
                                                            Average Raw Score
                                                            {rankingMetric === "raw" ? (
                                                                <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                                                                    Ranking
                                                                </span>
                                                            ) : null}
                                                        </th>
                                                        <th
                                                            className="px-4 py-3 text-left font-semibold text-white"
                                                            title="Adjusted for differences in judge scoring; returned to the overall-rating scale."
                                                        >
                                                            Average Overall Score
                                                            {rankingMetric === "overall" ? (
                                                                <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                                                                    Ranking
                                                                </span>
                                                            ) : null}
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Room
                                                        </th>
                                                        <th aria-label="Expand team details" />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan={5} className="bg-white px-4 py-8 text-center text-gray-500">
                                                                Loading judging dashboard…
                                                            </td>
                                                        </tr>
                                                    ) : visibleResults.map(({ team, result }) => (
                                                        <Fragment key={team.id}>
                                                            <tr
                                                                tabIndex={0}
                                                                aria-expanded={expandedTeamId === team.id}
                                                                onClick={() => toggleTeam(team.id)}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === "Enter" || event.key === " ") {
                                                                        event.preventDefault();
                                                                        toggleTeam(team.id);
                                                                    }
                                                                }}
                                                                className={`cursor-pointer border-b border-gray-200 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E00122] ${topTeamIds.has(team.id) ? "bg-[#E00122]/10" : "bg-white"
                                                                    }`}
                                                            >
                                                                <td className="px-4 py-3 font-medium text-[#333333]">
                                                                    {team.name}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-600">
                                                                    {formatScore(result?.average_score)}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-600">
                                                                    {formatScore(result?.average_corrected_score)}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-600">{team.room || "—"}</td>
                                                                <td className="px-4 py-3 text-right text-gray-500">
                                                                    <ChevronDown
                                                                        className={`ml-auto h-5 w-5 transition-transform ${expandedTeamId === team.id ? "rotate-180" : ""
                                                                            }`}
                                                                        aria-hidden="true"
                                                                    />
                                                                </td>
                                                            </tr>
                                                            {expandedTeamId === team.id ? (
                                                                <tr className="border-b border-gray-200 bg-slate-50">
                                                                    <td colSpan={5} className="px-4 py-5">
                                                                        <h3 className="mb-3 font-semibold text-gray-900">
                                                                            Judge Rubric Details
                                                                        </h3>
                                                                        {submissionsQuery.isError ? (
                                                                            <p role="alert" className="text-sm text-red-600">
                                                                                Could Not Load Rubric Details: {formatErrorMessage(submissionsQuery.error)}
                                                                            </p>
                                                                        ) : expandedSubmissions.length === 0 ? (
                                                                            <p className="text-sm text-gray-600">
                                                                                No rubric submissions have been recorded for this team.
                                                                            </p>
                                                                        ) : (
                                                                            <div className="grid gap-4 lg:grid-cols-3">
                                                                                {expandedSubmissions.map((submission) => (
                                                                                    <article
                                                                                        key={submission.id}
                                                                                        className="rounded-lg border border-gray-200 bg-white p-4"
                                                                                    >
                                                                                        <div className="flex items-center justify-between gap-3">
                                                                                            <h4 className="font-semibold text-gray-900">
                                                                                                {submission.judge_name}
                                                                                            </h4>
                                                                                            <div className="flex shrink-0 items-center gap-3">
                                                                                                <span
                                                                                                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-semibold tabular-nums text-gray-800 ring-1 ring-inset ring-gray-200"
                                                                                                    title="Average of this judge's 1–10 rubric ratings"
                                                                                                >
                                                                                                    {formatScore(getAverageRawScore(submission.scores))}
                                                                                                </span>
                                                                                                <span
                                                                                                    className={`text-sm font-semibold tabular-nums ${submission.overall_score_correction > 0
                                                                                                        ? "text-green-700"
                                                                                                        : submission.overall_score_correction < 0
                                                                                                            ? "text-red-700"
                                                                                                            : "text-gray-500"
                                                                                                        }`}
                                                                                                >
                                                                                                    {formatCorrection(submission.overall_score_correction)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <dl className="mt-3 space-y-2">
                                                                                            {rubricCriteria.map((criterion) => (
                                                                                                <div
                                                                                                    key={criterion.id}
                                                                                                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 text-sm"
                                                                                                >
                                                                                                    <dt className="min-w-0 text-gray-600">
                                                                                                        {criterion.title}
                                                                                                    </dt>
                                                                                                    <dd className="font-medium tabular-nums text-gray-900">
                                                                                                        {formatScore(submission.scores[criterion.id])}
                                                                                                    </dd>
                                                                                                </div>
                                                                                            ))}
                                                                                        </dl>
                                                                                        <div className="mt-4 border-t border-gray-100 pt-3">
                                                                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                                                Judge summary
                                                                                            </p>
                                                                                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                                                                {submission.feedback?.trim() || "No written feedback provided."}
                                                                                            </p>
                                                                                        </div>
                                                                                    </article>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </Fragment>
                                                    ))}
                                                    {!isLoading && !teamsQuery.isError && visibleResults.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="bg-white px-4 py-8 text-center text-gray-500">
                                                                No teams match the selected filters.
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                                            <p>
                                                <span
                                                    aria-hidden="true"
                                                    className="mr-2 inline-block size-3 rounded-sm bg-[#E00122]/10 ring-1 ring-inset ring-[#E00122]/30"
                                                />
                                                Highlighted rows mark the top 25% of scored teams ranked by {rankingLabel}.
                                            </p>
                                            <p className="sm:text-right">
                                                Showing {isLoading ? "…" : visibleResults.length} of{" "}
                                                {isLoading ? "…" : totalActiveTeamCount} teams
                                            </p>
                                        </div>
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
