import { Link } from "react-router-dom";
import Navbar from "@shared/components/layout/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { Label } from "@shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/select";
import Footer from "@shared/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { ArrowLeft, CircleCheckBig, Users } from "lucide-react";

const sampleResults = [
    { team: "AeroSense", averageScore: 8.7, correctedScore: 8.5, room: "Front of Kautz", judge: "Judge 1" },
    { team: "EcoTrack", averageScore: 7.9, correctedScore: 8.1, room: "Back of Kautz", judge: "Judge 2" },
    { team: "MedAssist", averageScore: 9.2, correctedScore: 9.0, room: "Front of Kautz", judge: "Judge 3" },
    { team: "SmartHarvest", averageScore: 8.3, correctedScore: 8.2, room: "Mrs.Lewis House", judge: "Judge 2" },
    { team: "WaterWise", averageScore: 7.6, correctedScore: 7.8, room: "Back of Kautz", judge: "Judge 1" },
    { team: "GymWro", averageScore: 8.4, correctedScore: 9.2, room: "Mrs.Lewis House", judge: "Judge 3" },
    { team: "H.O.P.E", averageScore: 8.1, correctedScore: 8.5, room: "Mrs.Lewis House", judge: "Judge 2" },
    { team: "TissueTrack", averageScore: 7.3, correctedScore: 7.5, room: "Back of Kautz", judge: "Judge 1" },
    { team: "BrightPath", averageScore: 8.8, correctedScore: 8.9, room: "Front of Kautz", judge: "Judge 1" },
    { team: "CircuitCycle", averageScore: 7.8, correctedScore: 7.9, room: "Back of Kautz", judge: "Judge 3" },
    { team: "CropSense", averageScore: 8.6, correctedScore: 8.7, room: "Mrs.Lewis House", judge: "Judge 2" },
    { team: "Evergreen Energy", averageScore: 9.1, correctedScore: 9.3, room: "Front of Kautz", judge: "Judge 3" },
    { team: "FlexiForm", averageScore: 7.5, correctedScore: 7.6, room: "Back of Kautz", judge: "Judge 2" },
    { team: "LumaLink", averageScore: 8.2, correctedScore: 8.4, room: "Mrs.Lewis House", judge: "Judge 1" },
    { team: "SafeStep", averageScore: 8.9, correctedScore: 9.1, room: "Front of Kautz", judge: "Judge 2" },
    { team: "SoundBridge", averageScore: 7.7, correctedScore: 7.4, room: "Back of Kautz", judge: "Judge 3" },
];

const uniqueTeamResults = Array.from(
    new Map(
        sampleResults.map((result) => [result.team.trim().toLowerCase(), result])
    ).values()
);

export default function JudgingDashboardPage() {
    const [selectedJudge, setSelectedJudge] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState("all");
    const judges = [...new Set(uniqueTeamResults.map((result) => result.judge))].sort();
    const rooms = [...new Set(uniqueTeamResults.map((result) => result.room))].sort();
    const filteredResults = uniqueTeamResults.filter(
        (result) =>
            (selectedJudge === "all" || result.judge === selectedJudge) &&
            (selectedRoom === "all" || result.room === selectedRoom)
    );
    const sortedResults = [...filteredResults].sort(
        (a, b) =>
            b.correctedScore - a.correctedScore ||
            b.averageScore - a.averageScore ||
            a.team.localeCompare(b.team)
    );
    const topTeamCount = Math.ceil(filteredResults.length * 0.25);
    const topTeamNames = new Set(
        sortedResults.slice(0, topTeamCount).map((result) => result.team)
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="min-h-screen bg-white">
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
                                Final Competition Judging Dashboard
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-600 text-center">
                                View judging results and team scores for the Innovation Challenge Final Competition.
                            </p>
                        </motion.div>
                    </div>
                </section>
                <section className="py-8 lg:py-12 bg-[#F9FAFB]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                    to="/innovation/admin/manage-judging"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                                >
                                    <Users className="h-4 w-4" />
                                    Manage Judges and Teams
                                </Link>
                            </div>
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-3 text-[#E00122]">
                                        <CircleCheckBig className="h-6 w-6" />
                                        <CardTitle className="text-xl">Final Competition Scoring</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <div className="mb-5 grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="filter-judge">Filter by judge</Label>
                                                <Select value={selectedJudge} onValueChange={setSelectedJudge}>
                                                    <SelectTrigger
                                                        id="filter-judge"
                                                        className="w-full border-gray-300 bg-white focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                    >
                                                        <SelectValue placeholder="All judges" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300">
                                                        <SelectItem value="all">All judges</SelectItem>
                                                        {judges.map((judge) => (
                                                            <SelectItem key={judge} value={judge}>
                                                                {judge}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="filter-room">Filter by room</Label>
                                                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                                    <SelectTrigger
                                                        id="filter-room"
                                                        className="w-full border-gray-300 bg-white focus-visible:border-gray-400 focus-visible:ring-gray-300/60"
                                                    >
                                                        <SelectValue placeholder="All rooms" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-300">
                                                        <SelectItem value="all">All rooms</SelectItem>
                                                        {rooms.map((room) => (
                                                            <SelectItem key={room} value={room}>
                                                                {room}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="max-h-[min(85vh,720px)] overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-lg border border-gray-200">
                                            <table className="w-full min-w-[720px] table-fixed text-sm">
                                                <colgroup>
                                                    <col className="w-[36%]" />
                                                    <col className="w-[15%]" />
                                                    <col className="w-[21%]" />
                                                    <col className="w-[14%]" />
                                                    <col className="w-[14%]" />
                                                </colgroup>
                                                <thead className="sticky top-0 z-10 bg-[#E00122] shadow-sm">
                                                    <tr className="border-b border-[#B8011C]">
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Team Name
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Average Score
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Average Corrected Score
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Room
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-white">
                                                            Judge
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedResults.map((result) => (
                                                        <tr
                                                            key={result.team}
                                                            className={`border-b border-gray-200 last:border-b-0 ${topTeamNames.has(result.team)
                                                                ? "bg-[#E00122]/10"
                                                                : "bg-white"
                                                                }`}
                                                        >
                                                            <td className="px-4 py-3 font-medium text-[#333333]">
                                                                {result.team}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {result.averageScore.toFixed(1)}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {result.correctedScore.toFixed(1)}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {result.room}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {result.judge}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {sortedResults.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={5}
                                                                className="bg-white px-4 py-8 text-center text-gray-500"
                                                            >
                                                                No teams match the selected filters.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                                            <p>
                                                <span
                                                    aria-hidden="true"
                                                    className="mr-2 inline-block size-3 rounded-sm bg-[#E00122]/10 ring-1 ring-inset ring-[#E00122]/30"
                                                />
                                                Highlighted rows mark the top 25% of the displayed teams by average
                                                corrected score.
                                            </p>
                                            <p className="sm:text-right">
                                                Showing {filteredResults.length} of {uniqueTeamResults.length} teams
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