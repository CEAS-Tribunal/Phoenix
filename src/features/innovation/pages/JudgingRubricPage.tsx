import Footer from "@shared/components/layout/Footer";
import Navbar from "@shared/components/layout/Navbar";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/select";
import { motion } from "framer-motion";
import { CircleCheckBig, Lightbulb, NotepadText } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { formatErrorMessage } from "@shared/lib/formatError";
import {
    listInnovationSubmissions,
    listJudges,
    listTeams,
    saveInnovationSubmission,
} from "../services/innovationService";
import { innovationKeys } from "../queryKeys";

const rubricCriteria = [
    {
        id: "presentation-quality",
        title: "Presentation Quality",
        description:
            "Was the pitch clear, engaging, and well organized? Did the team effectively communicate their idea and its value?",
    },
    {
        id: "business-model-clarity",
        title: "Business Model Clarity",
        description:
            "Was there a clear and realistic description of the business model? Are the costs and pricing strategies reasonable?",
    },
    {
        id: "value-proposition",
        title: "Value Proposition",
        description:
            "Was the product's value well-defined and effectively conveyed (e.g., faster, cheaper, or more efficient)?",
    },
    {
        id: "competitive-analysis",
        title: "Competitive Analysis",
        description:
            "Was the team knowledgeable about their competitors and how their product compares?",
    },
    {
        id: "market-analysis",
        title: "Market Analysis",
        description:
            "Has the team identified a significant, well-suited market for their product? Consider their go-to-market strategy and market suitability.",
    },
    {
        id: "product-prototype-understanding",
        title: "Product/Prototype Understanding",
        description:
            "Did the team have a clear idea of how their product works or will work? A well-defined or working prototype is a bonus.",
    },
    {
        id: "growth",
        title: "Growth",
        description:
            "Did the team describe their plan for further development or next steps?",
    },
    {
        id: "qa-effectiveness",
        title: "Q&A Effectiveness",
        description:
            "Was the team able to effectively answer questions from the judges and engage in conversation?",
    },
    {
        id: "overall-rating",
        title: "Overall Rating",
        description: "Rate the team on a scale of 1–10 based on your overall impression.",
    },
];

export default function JudgingRubricPage() {
    const [judgeId, setJudgeId] = useState("");
    const [teamId, setTeamId] = useState("");
    const [room, setRoom] = useState("");
    const [scores, setScores] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [successOpen, setSuccessOpen] = useState(false);
    const queryClient = useQueryClient();
    const judgesQuery = useQuery({
        queryKey: innovationKeys.judges(),
        queryFn: listJudges,
    });
    const teamsQuery = useQuery({
        queryKey: innovationKeys.teams(),
        queryFn: listTeams,
    });
    const availableTeams = (teamsQuery.data ?? []).filter(
        (team) => team.room === room
    );
    const savedSubmissionQuery = useQuery({
        queryKey: innovationKeys.submissions(teamId ? Number(teamId) : undefined),
        queryFn: () => listInnovationSubmissions(Number(teamId)),
        enabled: Boolean(judgeId && teamId),
    });
    const savedSubmission = savedSubmissionQuery.data?.find(
        (submission) => submission.judge_id === Number(judgeId)
    );
    const isLoadingSavedSubmission =
        Boolean(judgeId && teamId) && savedSubmissionQuery.isPending;

    useEffect(() => {
        if (!judgeId || !teamId || !savedSubmissionQuery.isSuccess) {
            return;
        }
        setScores(savedSubmission?.scores ?? {});
        setFeedback(savedSubmission?.feedback ?? "");
        setFieldErrors({});
    }, [judgeId, teamId, savedSubmission, savedSubmissionQuery.isSuccess]);

    const submitMutation = useMutation({
        mutationFn: saveInnovationSubmission,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: innovationKeys.results() }),
                queryClient.invalidateQueries({ queryKey: innovationKeys.submissions() }),
            ]);
            setTeamId("");
            setScores({});
            setFeedback("");
            setFieldErrors({});
            setSuccessOpen(true);
        },
    });

    function clearFieldError(field: string) {
        setFieldErrors((current) => {
            if (!(field in current)) {
                return current;
            }
            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    function handleJudgeChange(value: string) {
        submitMutation.reset();
        setJudgeId(value);
        setTeamId("");
        setScores({});
        setFeedback("");
        setFieldErrors({});
        const selectedJudge = judgesQuery.data?.find(
            (judge) => String(judge.id) === value
        );
        setRoom(selectedJudge?.room ?? "");
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitMutation.reset();
        const nextErrors: Record<string, string> = {};
        if (!judgeId) {
            nextErrors.judge = "Please select a judge.";
        }
        if (!teamId) {
            nextErrors.team = "Please select a team.";
        }
        if (!room.trim()) {
            nextErrors.room = "A room assignment is required for the selected judge.";
        }
        for (const criterion of rubricCriteria) {
            const score = scores[criterion.id];
            if (
                typeof score !== "number" ||
                !Number.isInteger(score) ||
                score < 1 ||
                score > 10
            ) {
                nextErrors[criterion.id] = "Please select a score from 1 to 10.";
            }
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        submitMutation.mutate({
            judge_id: Number(judgeId),
            team_id: Number(teamId),
            scores,
            feedback: feedback.trim(),
        });
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="min-h-screen bg-white">
                {successOpen ? (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Judging rubric submitted"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setSuccessOpen(false)}
                            aria-label="Close"
                        />
                        <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
                            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-[#E00122]">
                                        Submitted
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                        Judging rubric saved
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSuccessOpen(false)}
                                    className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    aria-label="Close popup"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-sm text-gray-600">
                                    Your rubric was saved successfully.
                                </p>
                                <p className="mt-3 text-sm font-medium text-gray-800">
                                    Would you like to submit another rubric?
                                </p>
                            </div>
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-200"
                                    onClick={() => setSuccessOpen(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-[#E00122] text-white hover:bg-[#B8011C]"
                                    onClick={() => {
                                        setSuccessOpen(false);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                >
                                    Submit another rubric
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
                <section className="bg-linear-to-b from-slate-50 to-white py-16 lg:py-24">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-6xl"
                        >
                            <div className="items-center gap-2 text-[#E00122] text-sm text-center font-semibold uppercase tracking-wide">
                                Innovation Challenge
                            </div>
                            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-center tracking-tight text-[#333333]">
                                Final Competition Judging Rubric
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-600 text-center">
                                Select your assigned judge and room, choose a team, and score each
                                required criterion from 1 to 10.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-8 lg:py-12 bg-[#F9FAFB]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-3 text-[#E00122]">
                                        <Lightbulb className="h-6 w-6" />
                                        <CardTitle className="text-2xl">Judging Rubric</CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-600">
                                        Complete every required field to score a team.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        {submitMutation.isError ? (
                                            <p className="text-sm text-red-600" role="alert">
                                                Could not save rubric: {formatErrorMessage(submitMutation.error)}
                                            </p>
                                        ) : null}
                                        <div className="w-full space-y-6">
                                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                                                <NotepadText className="h-4 w-4" />
                                                Basic Information
                                            </h3>
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label htmlFor="judge-name">
                                                        Judge Name <span className="text-red-600">*</span>
                                                    </Label>
                                                    <p className="text-xs text-gray-500">
                                                        Select the judge completing this rubric.
                                                    </p>
                                                    <Select
                                                        value={judgeId}
                                                        onValueChange={handleJudgeChange}
                                                        disabled={judgesQuery.isPending || judgesQuery.isError}
                                                    >
                                                        <SelectTrigger
                                                            id="judge-name"
                                                            aria-required="true"
                                                            aria-invalid={Boolean(fieldErrors.judge)}
                                                            aria-describedby={fieldErrors.judge ? "judge-error" : undefined}
                                                            className="w-full border-gray-300 focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                        >
                                                            <SelectValue
                                                                placeholder={
                                                                    judgesQuery.isPending
                                                                        ? "Loading judges…"
                                                                        : judgesQuery.isError
                                                                            ? "Judges unavailable"
                                                                            : "Select a judge"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent className="border-gray-300 outline-none focus:outline-none focus-visible:outline-none">
                                                            {(judgesQuery.data ?? []).map((judge) => (
                                                                <SelectItem key={judge.id} value={String(judge.id)}>
                                                                    {judge.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {judgesQuery.isError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            Could not load judges: {formatErrorMessage(judgesQuery.error)}
                                                        </p>
                                                    ) : null}
                                                    {fieldErrors.judge ? (
                                                        <p id="judge-error" className="text-sm text-red-600" role="alert">
                                                            {fieldErrors.judge}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="room">Room <span className="text-red-600">*</span></Label>
                                                    <p className="text-xs text-gray-500">
                                                        Automatically assigned based on the selected judge.
                                                    </p>
                                                    <Input
                                                        id="room"
                                                        value={room}
                                                        placeholder="Select a judge first to see the assigned room"
                                                        readOnly
                                                        aria-readonly="true"
                                                        aria-invalid={Boolean(fieldErrors.room)}
                                                        aria-describedby={fieldErrors.room ? "room-error" : undefined}
                                                        className="border-gray-300 bg-gray-50"
                                                    />
                                                    {fieldErrors.room ? (
                                                        <p id="room-error" className="text-sm text-red-600" role="alert">
                                                            {fieldErrors.room}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className="space-y-2 pb-1">
                                                    <Label htmlFor="team-name">Team Name <span className="text-red-600">*</span></Label>
                                                    <p className="text-xs text-gray-500">
                                                        Select the team that you are judging.
                                                    </p>
                                                    <Select
                                                        value={teamId}
                                                        onValueChange={(value) => {
                                                            submitMutation.reset();
                                                            setTeamId(value);
                                                            setScores({});
                                                            setFeedback("");
                                                            setFieldErrors({});
                                                        }}
                                                        disabled={
                                                            !judgeId ||
                                                            teamsQuery.isPending ||
                                                            teamsQuery.isError
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="team-name"
                                                            aria-required="true"
                                                            aria-invalid={Boolean(fieldErrors.team)}
                                                            aria-describedby={fieldErrors.team ? "team-error" : undefined}
                                                            className="w-full border-gray-300 focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                        >
                                                            <SelectValue
                                                                placeholder={
                                                                    !judgeId
                                                                        ? "Select a judge first"
                                                                        : teamsQuery.isPending
                                                                            ? "Loading teams…"
                                                                            : teamsQuery.isError
                                                                                ? "Teams unavailable"
                                                                                : availableTeams.length === 0
                                                                                    ? "No teams assigned to this room"
                                                                                    : "Select a team"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent className="border-gray-300 outline-none focus:outline-none focus-visible:outline-none">
                                                            {availableTeams.map((team) => (
                                                                <SelectItem key={team.id} value={String(team.id)}>
                                                                    {team.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {teamsQuery.isError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            Could not load teams: {formatErrorMessage(teamsQuery.error)}
                                                        </p>
                                                    ) : null}
                                                    {fieldErrors.team ? (
                                                        <p id="team-error" className="text-sm text-red-600" role="alert">
                                                            {fieldErrors.team}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                                                            <CircleCheckBig className="h-4 w-4" />
                                                            Rubric Criteria                                                        </h3>
                                                    </div>
                                                    {isLoadingSavedSubmission ? (
                                                        <p className="text-sm text-gray-500" role="status">
                                                            Checking for a saved rubric…
                                                        </p>
                                                    ) : null}
                                                    {savedSubmissionQuery.isError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            Could not load the existing rubric:{" "}
                                                            {formatErrorMessage(savedSubmissionQuery.error)} You can still submit a rubric.
                                                        </p>
                                                    ) : null}
                                                    <div className="space-y-5">
                                                        {rubricCriteria.map((criterion) => (
                                                            <section
                                                                key={criterion.id}
                                                                aria-labelledby={`${criterion.id}-title`}
                                                                className="space-y-2"
                                                            >
                                                                <h4
                                                                    id={`${criterion.id}-title`}
                                                                    className="font-medium text-[#333333]"
                                                                >
                                                                    {criterion.title}
                                                                    <span className="ml-1 text-red-600">*</span>
                                                                </h4>
                                                                <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                                                                    <p className="text-sm leading-relaxed text-gray-500">
                                                                        {criterion.description}
                                                                    </p>
                                                                    <div
                                                                        role="radiogroup"
                                                                        aria-labelledby={`${criterion.id}-title`}
                                                                        aria-required="true"
                                                                        aria-invalid={Boolean(fieldErrors[criterion.id])}
                                                                        aria-describedby={
                                                                            fieldErrors[criterion.id]
                                                                                ? `${criterion.id}-error`
                                                                                : undefined
                                                                        }
                                                                        className="grid grid-cols-10 gap-2"
                                                                        aria-label={`${criterion.title} rating`}
                                                                    >
                                                                        {Array.from(
                                                                            { length: 10 },
                                                                            (_, index) => index + 1
                                                                        ).map((score) => {
                                                                            const selected =
                                                                                scores[criterion.id] === score;

                                                                            return (
                                                                                <motion.button
                                                                                    key={score}
                                                                                    type="button"
                                                                                    aria-label={`${score} out of 10`}
                                                                                    role="radio"
                                                                                    aria-checked={selected}
                                                                                    disabled={
                                                                                        isLoadingSavedSubmission ||
                                                                                        submitMutation.isPending
                                                                                    }
                                                                                    onClick={() => {
                                                                                        submitMutation.reset();
                                                                                        clearFieldError(criterion.id);
                                                                                        setScores((current) => ({
                                                                                            ...current,
                                                                                            [criterion.id]: score,
                                                                                        }));
                                                                                    }}
                                                                                    whileHover={{ scale: 1.08 }}
                                                                                    whileTap={{ scale: 0.92 }}
                                                                                    animate={{
                                                                                        backgroundColor: selected
                                                                                            ? "#E00122"
                                                                                            : "#FFFFFF",
                                                                                        color: selected
                                                                                            ? "#FFFFFF"
                                                                                            : "#333333",
                                                                                        borderColor: selected
                                                                                            ? "#E00122"
                                                                                            : "#D1D5DB",
                                                                                    }}
                                                                                    transition={{
                                                                                        duration: 0.18,
                                                                                        ease: "easeOut",
                                                                                    }}
                                                                                    className="flex h-8 w-full min-w-0 items-center justify-center rounded-md border text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                                                >
                                                                                    {score}
                                                                                </motion.button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {fieldErrors[criterion.id] ? (
                                                                        <p
                                                                            id={`${criterion.id}-error`}
                                                                            className="text-sm text-red-600"
                                                                            role="alert"
                                                                        >
                                                                            {fieldErrors[criterion.id]}
                                                                        </p>
                                                                    ) : null}
                                                                    <p className="text-xs text-gray-500">
                                                                        {selectedScoreDescription(scores[criterion.id])}
                                                                    </p>
                                                                </div>
                                                            </section>
                                                        ))}
                                                        <div className="space-y-2">
                                                            <Label htmlFor="team-feedback">Comments (optional)</Label>
                                                            <p className="text-xs text-gray-500">
                                                                Share one or two sentences about the team's
                                                                biggest opportunities for improvement. Or any other feedback you would like to provide.
                                                            </p>
                                                            <textarea
                                                                id="team-feedback"
                                                                rows={4}
                                                                value={feedback}
                                                                onChange={(event) => {
                                                                    submitMutation.reset();
                                                                    setFeedback(event.target.value);
                                                                }}
                                                                disabled={
                                                                    isLoadingSavedSubmission ||
                                                                    submitMutation.isPending
                                                                }
                                                                placeholder="Enter optional comments for the team"
                                                                className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#333333] placeholder:text-gray-400 focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/60"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={
                                                isLoadingSavedSubmission ||
                                                submitMutation.isPending
                                            }
                                            className="rounded-md bg-[#E00122] text-white hover:bg-[#B8011C] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {submitMutation.isPending
                                                ? "Saving rubric…"
                                                : savedSubmission
                                                    ? "Update Rubric"
                                                    : "Submit Rubric"}
                                        </Button>
                                    </form>
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

function selectedScoreDescription(score: number | undefined) {
    if (score === undefined) {
        return "Select a score from 1 to 10.";
    }

    return `Selected score: ${score} out of 10`;
}
