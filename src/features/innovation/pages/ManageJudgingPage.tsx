import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    LayoutList,
    Pencil,
    Trash2,
    UserRound,
    Users,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/select";
import { formatErrorMessage } from "@shared/lib/formatError";
import {
    createJudge,
    createTeam,
    deleteJudge,
    deleteTeam,
    listInnovationRooms,
    listJudges,
    listTeams,
    updateJudge,
    updateTeam,
    type InnovationJudge,
    type InnovationTeam,
} from "../services/innovationService";
import { innovationKeys } from "../queryKeys";

type ManagedRecordRowProps = {
    name: string;
    detail?: string;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

function ManagedRecordRow({
    name,
    detail,
    isDeleting,
    onEdit,
    onDelete,
}: ManagedRecordRowProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="font-medium text-gray-900">{name}</p>
                {detail ? <p className="mt-1 text-sm text-gray-600">{detail}</p> : null}
            </div>
            {confirmingDelete ? (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-200"
                        disabled={isDeleting}
                        onClick={() => setConfirmingDelete(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        className="h-8 bg-rose-600 text-white hover:bg-rose-700"
                        disabled={isDeleting}
                        onClick={onDelete}
                    >
                        {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-200"
                        onClick={onEdit}
                    >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                        onClick={() => setConfirmingDelete(true)}
                        aria-label={`Delete ${name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

function errorMessage(
    clientError: string | null,
    ...mutationErrors: unknown[]
): string | null {
    if (clientError) return clientError;
    const error = mutationErrors.find((value) => value !== null && value !== undefined);
    return error === undefined ? null : formatErrorMessage(error);
}

export default function ManageJudgingPage() {
    const queryClient = useQueryClient();
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

    const [judgeName, setJudgeName] = useState("");
    const [judgeRoom, setJudgeRoom] = useState("");
    const [editingJudgeId, setEditingJudgeId] = useState<number | null>(null);
    const [judgeClientError, setJudgeClientError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState("");
    const [teamRoom, setTeamRoom] = useState("");
    const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
    const [teamClientError, setTeamClientError] = useState<string | null>(null);

    function invalidateJudges() {
        void queryClient.invalidateQueries({ queryKey: innovationKeys.judges() });
    }

    function invalidateTeams() {
        void queryClient.invalidateQueries({ queryKey: innovationKeys.teams() });
    }

    function resetJudgeForm() {
        setJudgeName("");
        setJudgeRoom("");
        setEditingJudgeId(null);
        setJudgeClientError(null);
    }

    function resetTeamForm() {
        setTeamName("");
        setTeamRoom("");
        setEditingTeamId(null);
        setTeamClientError(null);
    }

    const createJudgeMutation = useMutation({
        mutationFn: createJudge,
        onSuccess: () => {
            invalidateJudges();
            resetJudgeForm();
        },
    });
    const updateJudgeMutation = useMutation({
        mutationFn: ({
            id,
            name,
            room,
        }: {
            id: number;
            name: string;
            room: string;
        }) => updateJudge(id, { name, room }),
        onSuccess: () => {
            invalidateJudges();
            resetJudgeForm();
        },
    });
    const deleteJudgeMutation = useMutation({
        mutationFn: deleteJudge,
        onSuccess: invalidateJudges,
    });

    const createTeamMutation = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            invalidateTeams();
            resetTeamForm();
        },
    });
    const updateTeamMutation = useMutation({
        mutationFn: ({
            id,
            name,
            room,
        }: {
            id: number;
            name: string;
            room: string;
        }) => updateTeam(id, { name, room }),
        onSuccess: () => {
            invalidateTeams();
            resetTeamForm();
        },
    });
    const deleteTeamMutation = useMutation({
        mutationFn: deleteTeam,
        onSuccess: invalidateTeams,
    });

    function handleJudgeSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const name = judgeName.trim();
        const room = judgeRoom;
        setJudgeClientError(null);
        createJudgeMutation.reset();
        updateJudgeMutation.reset();

        if (!name || !room) {
            setJudgeClientError("Enter a judge name and select a room.");
            return;
        }

        if (editingJudgeId === null) {
            createJudgeMutation.mutate({ name, room });
        } else {
            updateJudgeMutation.mutate({ id: editingJudgeId, name, room });
        }
    }

    function handleTeamSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const name = teamName.trim();
        const room = teamRoom.trim();
        setTeamClientError(null);
        createTeamMutation.reset();
        updateTeamMutation.reset();

        if (!name || !room) {
            setTeamClientError("Enter both a team name and room.");
            return;
        }

        if (editingTeamId === null) {
            createTeamMutation.mutate({ name, room });
        } else {
            updateTeamMutation.mutate({ id: editingTeamId, name, room });
        }
    }

    function startEditingJudge(judge: InnovationJudge) {
        createJudgeMutation.reset();
        updateJudgeMutation.reset();
        deleteJudgeMutation.reset();
        setJudgeClientError(null);
        setEditingJudgeId(judge.id);
        setJudgeName(judge.name);
        setJudgeRoom(judge.room);
    }

    function startEditingTeam(team: InnovationTeam) {
        createTeamMutation.reset();
        updateTeamMutation.reset();
        deleteTeamMutation.reset();
        setTeamClientError(null);
        setEditingTeamId(team.id);
        setTeamName(team.name);
        setTeamRoom(team.room);
    }

    function handleDeleteJudge(id: number) {
        deleteJudgeMutation.reset();
        deleteJudgeMutation.mutate(id, {
            onSuccess: () => {
                if (editingJudgeId === id) resetJudgeForm();
            },
        });
    }

    function handleDeleteTeam(id: number) {
        deleteTeamMutation.reset();
        deleteTeamMutation.mutate(id, {
            onSuccess: () => {
                if (editingTeamId === id) resetTeamForm();
            },
        });
    }

    const judgeError = errorMessage(
        judgeClientError,
        createJudgeMutation.error,
        updateJudgeMutation.error,
        deleteJudgeMutation.error
    );
    const teamError = errorMessage(
        teamClientError,
        createTeamMutation.error,
        updateTeamMutation.error,
        deleteTeamMutation.error
    );
    const isSavingJudge = createJudgeMutation.isPending || updateJudgeMutation.isPending;
    const isSavingTeam = createTeamMutation.isPending || updateTeamMutation.isPending;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="min-h-screen bg-white">
                <section className="py-16 lg:py-24">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                                    to="/innovation/admin/judging-dashboard"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                                >
                                    <LayoutList className="h-4 w-4" />
                                    Judging Dashboard
                                </Link>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-[#E00122]">
                                    <Users className="h-6 w-6" />
                                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                                        Manage Judges and Teams
                                    </h1>
                                </div>
                                <p className="mt-1 max-w-3xl text-sm text-gray-600">
                                    Add, edit, or remove judges and Innovation Challenge teams.
                                </p>
                            </div>

                            <div className="space-y-12">
                                <section aria-labelledby="judges-heading">
                                    <div className="mb-4 flex items-center gap-2 text-[#E00122]">
                                        <UserRound className="h-5 w-5" />
                                        <h2
                                            id="judges-heading"
                                            className="text-lg font-semibold tracking-tight text-gray-900"
                                        >
                                            Judges
                                        </h2>
                                    </div>
                                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                                        <div
                                            className={
                                                judgesQuery.data?.length
                                                    ? `space-y-3 rounded-xl border border-[#E00122]/15 bg-[#E00122]/5 p-4 ${judgesQuery.data.length >= 4
                                                        ? "max-h-[600px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-h-[400px]"
                                                        : ""
                                                    }`
                                                    : "space-y-3"
                                            }
                                        >
                                            {judgesQuery.isPending ? (
                                                <p className="rounded-xl border border-gray-200 px-4 py-12 text-center text-sm text-gray-500">
                                                    Loading judges…
                                                </p>
                                            ) : judgesQuery.isError ? (
                                                <p
                                                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-12 text-center text-sm text-rose-700"
                                                    role="alert"
                                                >
                                                    {formatErrorMessage(judgesQuery.error)}
                                                </p>
                                            ) : judgesQuery.data.length === 0 ? (
                                                <p className="rounded-xl border border-[#E00122]/15 bg-[#E00122]/5 px-4 py-12 text-center text-sm text-gray-600">
                                                    No judges yet. Add one to get started.
                                                </p>
                                            ) : (
                                                judgesQuery.data.map((judge) => (
                                                    <ManagedRecordRow
                                                        key={judge.id}
                                                        name={judge.name}
                                                        detail={judge.room}
                                                        isDeleting={
                                                            deleteJudgeMutation.isPending &&
                                                            deleteJudgeMutation.variables === judge.id
                                                        }
                                                        onEdit={() => startEditingJudge(judge)}
                                                        onDelete={() => handleDeleteJudge(judge.id)}
                                                    />
                                                ))
                                            )}
                                        </div>

                                        <Card className="h-fit border-gray-200 shadow-sm lg:sticky lg:top-24">
                                            <CardHeader>
                                                <div className="flex items-center gap-2 text-[#E00122]">
                                                    <UserRound className="h-5 w-5" />
                                                    <CardTitle className="text-lg">
                                                        {editingJudgeId === null ? "Add a judge" : "Edit judge"}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription>
                                                    Judges are available to select on the judging rubric.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleJudgeSubmit} className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="judge-name">Name</Label>
                                                        <Input
                                                            id="judge-name"
                                                            value={judgeName}
                                                            onChange={(event) => setJudgeName(event.target.value)}
                                                            maxLength={120}
                                                            placeholder="e.g. Alex Smith"
                                                            className="border-gray-200"
                                                            disabled={isSavingJudge}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="judge-room">Room</Label>
                                                        <Select
                                                            value={judgeRoom}
                                                            onValueChange={setJudgeRoom}
                                                            disabled={
                                                                isSavingJudge ||
                                                                roomsQuery.isPending ||
                                                                roomsQuery.isError
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id="judge-room"
                                                                className="w-full border-gray-300 focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                            >
                                                                <SelectValue
                                                                    placeholder={
                                                                        roomsQuery.isPending
                                                                            ? "Loading rooms…"
                                                                            : roomsQuery.isError
                                                                                ? "Rooms unavailable"
                                                                                : "Select a room"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-gray-300 outline-none focus:outline-none focus-visible:outline-none">
                                                                {(roomsQuery.data ?? []).map((room) => (
                                                                    <SelectItem key={room.value} value={room.value}>
                                                                        {room.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {roomsQuery.isError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            Could not load rooms: {formatErrorMessage(roomsQuery.error)}
                                                        </p>
                                                    ) : null}
                                                    {judgeError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            {judgeError}
                                                        </p>
                                                    ) : null}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            className="flex-1 bg-[#E00122] text-white hover:bg-[#B8011C]"
                                                            disabled={
                                                                isSavingJudge ||
                                                                roomsQuery.isPending ||
                                                                roomsQuery.isError
                                                            }
                                                        >
                                                            {isSavingJudge
                                                                ? "Saving…"
                                                                : editingJudgeId === null
                                                                    ? "Add judge"
                                                                    : "Save changes"}
                                                        </Button>
                                                        {editingJudgeId !== null ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="border-gray-200"
                                                                disabled={isSavingJudge}
                                                                onClick={resetJudgeForm}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </section>

                                <section aria-labelledby="teams-heading">
                                    <div className="mb-4 flex items-center gap-2 text-[#E00122]">
                                        <Users className="h-5 w-5" />
                                        <h2
                                            id="teams-heading"
                                            className="text-lg font-semibold tracking-tight text-gray-900"
                                        >
                                            Teams
                                        </h2>
                                    </div>
                                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                                        <div
                                            className={
                                                teamsQuery.data?.length
                                                    ? `space-y-3 rounded-xl border border-[#E00122]/15 bg-[#E00122]/5 p-4 ${teamsQuery.data.length >= 4
                                                        ? "max-h-[600px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:max-h-[400px]"
                                                        : ""
                                                    }`
                                                    : "space-y-3"
                                            }
                                        >
                                            {teamsQuery.isPending ? (
                                                <p className="rounded-xl border border-gray-200 px-4 py-12 text-center text-sm text-gray-500">
                                                    Loading teams…
                                                </p>
                                            ) : teamsQuery.isError ? (
                                                <p
                                                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-12 text-center text-sm text-rose-700"
                                                    role="alert"
                                                >
                                                    {formatErrorMessage(teamsQuery.error)}
                                                </p>
                                            ) : teamsQuery.data.length === 0 ? (
                                                <p className="rounded-xl border border-[#E00122]/15 bg-[#E00122]/5 px-4 py-12 text-center text-sm text-gray-600">
                                                    No teams yet. Add one to get started.
                                                </p>
                                            ) : (
                                                teamsQuery.data.map((team) => (
                                                    <ManagedRecordRow
                                                        key={team.id}
                                                        name={team.name}
                                                        detail={team.room}
                                                        isDeleting={
                                                            deleteTeamMutation.isPending &&
                                                            deleteTeamMutation.variables === team.id
                                                        }
                                                        onEdit={() => startEditingTeam(team)}
                                                        onDelete={() => handleDeleteTeam(team.id)}
                                                    />
                                                ))
                                            )}
                                        </div>

                                        <Card className="h-fit border-gray-200 shadow-sm lg:sticky lg:top-24">
                                            <CardHeader>
                                                <div className="flex items-center gap-2 text-[#E00122]">
                                                    <Users className="h-5 w-5" />
                                                    <CardTitle className="text-lg">
                                                        {editingTeamId === null ? "Add a team" : "Edit team"}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription>
                                                    Teams and their rooms appear on the judging rubric.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleTeamSubmit} className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="team-name">Team name</Label>
                                                        <Input
                                                            id="team-name"
                                                            value={teamName}
                                                            onChange={(event) => setTeamName(event.target.value)}
                                                            maxLength={160}
                                                            placeholder="e.g. AeroSense"
                                                            className="border-gray-200"
                                                            disabled={isSavingTeam}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="team-room">Room</Label>
                                                        <Select
                                                            value={teamRoom}
                                                            onValueChange={setTeamRoom}
                                                            disabled={
                                                                isSavingTeam ||
                                                                roomsQuery.isPending ||
                                                                roomsQuery.isError
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id="team-room"
                                                                className="w-full border-gray-300 focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                            >
                                                                <SelectValue
                                                                    placeholder={
                                                                        roomsQuery.isPending
                                                                            ? "Loading rooms…"
                                                                            : roomsQuery.isError
                                                                                ? "Rooms unavailable"
                                                                                : "Select a room"
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent className="border-gray-300 outline-none focus:outline-none focus-visible:outline-none">
                                                                {(roomsQuery.data ?? []).map((room) => (
                                                                    <SelectItem key={room.value} value={room.value}>
                                                                        {room.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {roomsQuery.isError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            Could not load rooms: {formatErrorMessage(roomsQuery.error)}
                                                        </p>
                                                    ) : null}
                                                    {teamError ? (
                                                        <p className="text-sm text-red-600" role="alert">
                                                            {teamError}
                                                        </p>
                                                    ) : null}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            className="flex-1 bg-[#E00122] text-white hover:bg-[#B8011C]"
                                                            disabled={
                                                                isSavingTeam ||
                                                                roomsQuery.isPending ||
                                                                roomsQuery.isError
                                                            }
                                                        >
                                                            {isSavingTeam
                                                                ? "Saving…"
                                                                : editingTeamId === null
                                                                    ? "Add team"
                                                                    : "Save changes"}
                                                        </Button>
                                                        {editingTeamId !== null ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="border-gray-200"
                                                                disabled={isSavingTeam}
                                                                onClick={resetTeamForm}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
