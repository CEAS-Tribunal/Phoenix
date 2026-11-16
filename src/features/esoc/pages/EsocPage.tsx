import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Banknote,
  CalendarDays,
  Download,
  HandCoins,
  Plus,
  Trash2,
  Users,
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
  ESOC_CONTACT_EMAIL,
  ESOC_PROCESS_STEPS,
  ESOC_TEMPLATES,
} from "../data/esocContent";
import {
  listOpenEsocDates,
  submitEsocRequest,
  type EsocClub,
  type EsocClubPerson,
} from "../services/esocService";
import { esocKeys } from "../queryKeys";

/** Underline-only row: outer wrapper supplies `border-b`; inner kills default Input chrome. */
const minimalInputClass = cn(
  "w-full border-0 rounded-none bg-transparent px-0 py-2 shadow-none h-auto min-h-9 text-base md:text-base",
  "placeholder:text-gray-400 text-gray-900",
  "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent focus-visible:outline-none"
);

const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

type ClubPersonDraft = EsocClubPerson & { key: string };
type ClubDraft = Omit<EsocClub, "people"> & { key: string; people: ClubPersonDraft[] };

let clubCounter = 0;
let personCounter = 0;
function newPerson(): ClubPersonDraft {
  personCounter += 1;
  return { key: `club-person-${personCounter}`, name: "", email: "", role: "" };
}

function newClub(): ClubDraft {
  clubCounter += 1;
  return { key: `club-${clubCounter}`, clubName: "", people: [newPerson()] };
}

export default function EsocPage() {
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const successDialogRef = useRef<HTMLDialogElement>(null);
  const [organizationName, setOrganizationName] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [mNumber, setMNumber] = useState("");
  const [position, setPosition] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [involvesTravel, setInvolvesTravel] = useState(false);
  const [fundingDateId, setFundingDateId] = useState("");
  const [clubs, setClubs] = useState<ClubDraft[]>([]);
  const [w9File, setW9File] = useState<File | null>(null);
  const [applicationFile, setApplicationFile] = useState<File | null>(null);
  const [slidesFile, setSlidesFile] = useState<File | null>(null);
  const [travelFile, setTravelFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fileInputsKey, setFileInputsKey] = useState(0);

  // Open dates are optional: if the backend endpoint is unavailable the form still works.
  const datesQuery = useQuery({
    queryKey: esocKeys.openDates(),
    queryFn: listOpenEsocDates,
    retry: false,
  });
  const openDates = useMemo(() => datesQuery.data ?? [], [datesQuery.data]);

  useEffect(() => {
    const dialog = successDialogRef.current;
    if (!dialog) return;
    if (successOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [successOpen]);

  const submitMutation = useMutation({
    mutationFn: submitEsocRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: esocKeys.all });
      setOrganizationName("");
      setRequesterName("");
      setRequesterEmail("");
      setMNumber("");
      setPosition("");
      setRequestedAmount("");
      setPurpose("");
      setInvolvesTravel(false);
      setFundingDateId("");
      setClubs([]);
      setW9File(null);
      setApplicationFile(null);
      setSlidesFile(null);
      setTravelFile(null);
      setClientError(null);
      setFileInputsKey((k) => k + 1);
      setSuccessOpen(true);
    },
  });

  function addClub() {
    setClubs((prev) => [...prev, newClub()]);
  }

  function removeClub(key: string) {
    setClubs((prev) => prev.filter((club) => club.key !== key));
  }

  function addPerson(clubKey: string) {
    setClubs((prev) =>
      prev.map((club) =>
        club.key === clubKey && club.people.length < 2
          ? { ...club, people: [...club.people, newPerson()] }
          : club
      )
    );
  }

  function removePerson(clubKey: string, personKey: string) {
    setClubs((prev) =>
      prev.map((club) =>
        club.key === clubKey
          ? { ...club, people: club.people.filter((person) => person.key !== personKey) }
          : club
      )
    );
  }

  function updateClubName(key: string, clubName: string) {
    setClubs((prev) =>
      prev.map((club) => (club.key === key ? { ...club, clubName } : club))
    );
  }

  function updatePerson(
    clubKey: string,
    personKey: string,
    field: keyof EsocClubPerson,
    value: string
  ) {
    setClubs((prev) =>
      prev.map((club) =>
        club.key === clubKey
          ? {
              ...club,
              people: club.people.map((person) =>
                person.key === personKey ? { ...person, [field]: value } : person
              ),
            }
          : club
      )
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setClientError(null);
    submitMutation.reset();

    if (!organizationName.trim()) {
      setClientError("Please enter the organization requesting funding.");
      return;
    }
    if (!requesterName.trim()) {
      setClientError("Please enter your name.");
      return;
    }
    if (!requesterEmail.trim()) {
      setClientError("Please enter your email.");
      return;
    }
    if (!mNumber.trim()) {
      setClientError("Please enter your M number.");
      return;
    }
    if (!position.trim()) {
      setClientError("Please enter your position in the organization.");
      return;
    }
    if (!purpose.trim()) {
      setClientError("Please describe what the funding is for.");
      return;
    }
    if (requestedAmount.trim()) {
      const amt = Number.parseFloat(requestedAmount);
      if (Number.isNaN(amt) || amt < 0) {
        setClientError("Please enter a valid requested amount.");
        return;
      }
    }
    const cleanedClubs = clubs.map((club) => ({
      clubName: club.clubName.trim(),
      people: club.people.map((person) => ({
        name: person.name.trim(),
        email: person.email.trim(),
        role: person.role.trim(),
      })),
    }));
    for (const club of cleanedClubs) {
      if (!club.clubName) {
        setClientError("Each additional club needs a club name.");
        return;
      }
      if (club.people.length === 0 || club.people.length > 2) {
        setClientError("Each additional club needs one or two people.");
        return;
      }
      for (const person of club.people) {
        if (!person.name || !person.email || !person.role) {
          setClientError("Each club person needs a name, email, and role.");
          return;
        }
      }
    }
    if (!w9File) {
      setClientError("A W-9 is required.");
      return;
    }
    if (!applicationFile) {
      setClientError("The funding application is required.");
      return;
    }
    if (!slidesFile) {
      setClientError("Presentation slides are required.");
      return;
    }
    if (involvesTravel && !travelFile) {
      setClientError(
        "A travel authorization is required when your request involves travel."
      );
      return;
    }

    submitMutation.mutate({
      organizationName: organizationName.trim(),
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim(),
      mNumber: mNumber.trim(),
      position: position.trim(),
      requestedAmount: requestedAmount.trim()
        ? Number.parseFloat(requestedAmount).toFixed(2)
        : undefined,
      purpose: purpose.trim(),
      involvesTravel,
      fundingDateId: fundingDateId ? Number.parseInt(fundingDateId, 10) : null,
      additionalClubs: cleanedClubs,
      w9: w9File,
      application: applicationFile,
      slides: slidesFile,
      travelAuthorization: involvesTravel ? travelFile : null,
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <dialog
          ref={successDialogRef}
          className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none bg-transparent p-4 open:flex open:items-center open:justify-center backdrop:bg-black/40"
          aria-label="ESOC request submitted"
          onClose={() => setSuccessOpen(false)}
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#E00122] uppercase">
                  Submitted
                </p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  Funding request sent
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
                Your request was submitted successfully. The ESOC chair and the
                treasurer have been notified and will follow up at the email you provided.
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
                Submit another request
              </Button>
            </div>
          </div>
        </dialog>

        {/* Presentation template */}
        <section className="border-b border-gray-100 bg-white py-8 lg:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="border-[#E00122]/20 bg-red-50/40">
              <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                    Presentation template
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#333333]">
                    Download the ESOC presentation template
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                    Use this template to prepare the slides you will present to the ESOC
                    committee with your funding request.
                  </p>
                </div>
                <a
                  href="/esoc_files/ESOC_Template.pptx"
                  download="ESOC_Template.pptx"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#E00122] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B8011C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E00122] focus-visible:ring-offset-2"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download presentation template
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Intro / process */}
        <section className="bg-linear-to-b from-slate-50 to-white py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 text-[#E00122] text-xs font-semibold uppercase tracking-wide">
                <HandCoins className="h-4 w-4" />
                ESOC Funding
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#333333]">
                Request funding for your Event
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                CEAS Tribunal helps fund student organizations across the College of
                Engineering and Applied Science. This page replaces the back-and-forth email
                chains: submit your request and all of your documents in one place, and the
                ESOC committee will take it from there.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Questions? Reach out at{" "}
                <a
                  href={`mailto:${ESOC_CONTACT_EMAIL}`}
                  className="text-[#E00122] hover:underline"
                >
                  {ESOC_CONTACT_EMAIL}
                </a>
                .
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ESOC_PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <Card className="h-full border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E00122]/10 text-sm font-bold text-[#E00122]">
                        {i + 1}
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#333333]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 text-[#E00122]">
                    <Banknote className="h-6 w-6" />
                    <CardTitle className="text-2xl">Funding Request Form</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Tell us who is requesting, what the funding is for, and attach the required
                    documents (W-9, funding application, and presentation slides). If your
                    request involves travel, add a travel authorization as well.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Requester info */}
                    <div className="space-y-6 max-w-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Requester information
                      </h3>
                      <div className="space-y-5">
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="org-name" className="sr-only">
                            Organization requesting
                          </Label>
                          <Input
                            id="org-name"
                            type="text"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="Organization requesting"
                            autoComplete="organization"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="req-name" className="sr-only">
                            Your name
                          </Label>
                          <Input
                            id="req-name"
                            type="text"
                            value={requesterName}
                            onChange={(e) => setRequesterName(e.target.value)}
                            placeholder="Your name"
                            autoComplete="name"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="req-email" className="sr-only">
                            Your email
                          </Label>
                          <Input
                            id="req-email"
                            type="email"
                            value={requesterEmail}
                            onChange={(e) => setRequesterEmail(e.target.value)}
                            placeholder="Your email"
                            autoComplete="email"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="req-mnumber" className="sr-only">
                            M number
                          </Label>
                          <Input
                            id="req-mnumber"
                            type="text"
                            value={mNumber}
                            onChange={(e) => setMNumber(e.target.value)}
                            placeholder="M number"
                            autoComplete="off"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="req-position" className="sr-only">
                            Your position
                          </Label>
                          <Input
                            id="req-position"
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Your position (e.g. President, Treasurer)"
                            className={minimalInputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional clubs */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                          <Users className="h-4 w-4" />
                          Add club
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1 border-[#E00122]/30 text-[#E00122] hover:bg-red-50"
                          onClick={addClub}
                        >
                          <Plus className="h-4 w-4" />
                          Add club
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                      Add other clubs and up to two people for each club. Include each person’s
                      role within their club.
                      </p>
                      {clubs.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400">
                          No additional clubs added.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {clubs.map((club) => (
                            <div
                              key={club.key}
                              className="space-y-3 rounded-xl border border-gray-200 bg-slate-50/50 p-4"
                            >
                              <Input
                                type="text"
                                value={club.clubName}
                                onChange={(e) => updateClubName(club.key, e.target.value)}
                                placeholder="Club name"
                                className="bg-white"
                                aria-label="Additional club name"
                              />
                              {club.people.map((person, index) => (
                                <div
                                  key={person.key}
                                  className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                                >
                                  <Input
                                    type="text"
                                    value={person.name}
                                    onChange={(e) =>
                                      updatePerson(club.key, person.key, "name", e.target.value)
                                    }
                                    placeholder={`Person ${index + 1} name`}
                                    className="bg-white"
                                    aria-label={`Additional club person ${index + 1} name`}
                                  />
                                  <Input
                                    type="email"
                                    value={person.email}
                                    onChange={(e) =>
                                      updatePerson(club.key, person.key, "email", e.target.value)
                                    }
                                    placeholder="Email"
                                    className="bg-white"
                                    aria-label={`Additional club person ${index + 1} email`}
                                  />
                                  <Input
                                    type="text"
                                    value={person.role}
                                    onChange={(e) =>
                                      updatePerson(club.key, person.key, "role", e.target.value)
                                    }
                                    placeholder="Role in club"
                                    className="bg-white"
                                    aria-label={`Additional club person ${index + 1} role`}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="justify-self-start text-gray-400 hover:bg-red-50 hover:text-[#E00122] sm:justify-self-center"
                                    onClick={() => removePerson(club.key, person.key)}
                                    aria-label={`Remove person ${index + 1}`}
                                    disabled={club.people.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex flex-wrap justify-between gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#E00122] hover:bg-red-50"
                                  onClick={() => addPerson(club.key)}
                                  disabled={club.people.length >= 2}
                                >
                                  <Plus className="mr-1 h-4 w-4" />
                                  Add person
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:bg-red-50 hover:text-[#E00122]"
                                  onClick={() => removeClub(club.key)}
                                >
                                  <Trash2 className="mr-1 h-4 w-4" />
                                  Remove club
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Request details */}
                    <div className="space-y-6 max-w-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Request details
                      </h3>
                      <div className="space-y-5">
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="amount" className="sr-only">
                            Requested amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={requestedAmount}
                            onChange={(e) => setRequestedAmount(e.target.value)}
                            placeholder="Requested amount (optional)"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="purpose" className="sr-only">
                            Purpose of funding
                          </Label>
                          <textarea
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="What is the funding for?"
                            rows={3}
                            className={cn(
                              minimalInputClass,
                              "flex resize-none min-h-16 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                          />
                        </div>
                      </div>

                      {openDates.length > 0 ? (
                        <div className="space-y-2">
                          <Label
                            htmlFor="funding-date"
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CalendarDays className="h-4 w-4 text-[#E00122]" />
                            Preferred funding / presentation date
                          </Label>
                          <select
                            id="funding-date"
                            value={fundingDateId}
                            onChange={(e) => setFundingDateId(e.target.value)}
                            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E00122]/25"
                          >
                            <option value="">No preference / not applicable</option>
                            {openDates.map((d) => (
                              <option key={d.id} value={d.id}>
                                {formatDateLabel(d.date)}
                                {d.label ? ` — ${d.label}` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-slate-50/60 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Does this request involve travel?
                          </p>
                          <p className="text-xs text-gray-600">
                            Turn this on to attach a travel authorization document.
                          </p>
                        </div>
                        <Switch
                          checked={involvesTravel}
                          onCheckedChange={setInvolvesTravel}
                          className="data-[state=checked]:bg-[#E00122]"
                        />
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Required documents
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="w9">W-9 (required)</Label>
                        <p className="text-sm text-gray-500">
                          Download the blank W-9, fill it out, then upload the completed form.{" "}
                          <a
                            href={ESOC_TEMPLATES.w9}
                            download="W-9.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[#E00122] hover:underline"
                          >
                            Download template
                          </a>
                        </p>
                        <Input
                          id="w9"
                          type="file"
                          accept=".pdf,image/*"
                          key={`w9-${fileInputsKey}`}
                          onChange={(e) => setW9File(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-[#E00122] file:px-3 file:py-1 file:text-white file:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="application">Funding application (required)</Label>
                        <p className="text-sm text-gray-500">
                          Download the blank ESOC application, fill it out, then upload the
                          completed form.{" "}
                          <a
                            href={ESOC_TEMPLATES.application}
                            download="EsocApprovalForm.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[#E00122] hover:underline"
                          >
                            Download template
                          </a>
                        </p>
                        <Input
                          id="application"
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          key={`application-${fileInputsKey}`}
                          onChange={(e) => setApplicationFile(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-[#E00122] file:px-3 file:py-1 file:text-white file:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slides">Presentation slides (required)</Label>
                        <p className="text-sm text-gray-500">
                          The slide deck you will present to the committee. PDF preferred.
                        </p>
                        <Input
                          id="slides"
                          type="file"
                          accept=".pdf,.ppt,.pptx"
                          key={`slides-${fileInputsKey}`}
                          onChange={(e) => setSlidesFile(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-[#E00122] file:px-3 file:py-1 file:text-white file:text-sm"
                        />
                      </div>
                      {involvesTravel ? (
                        <div className="space-y-2">
                          <Label htmlFor="travel">Travel authorization (required for travel)</Label>
                          <p className="text-sm text-gray-500">
                            Required because you indicated this request involves travel.
                          </p>
                          <Input
                            id="travel"
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            key={`travel-${fileInputsKey}`}
                            onChange={(e) => setTravelFile(e.target.files?.[0] ?? null)}
                            className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-[#E00122] file:px-3 file:py-1 file:text-white file:text-sm"
                          />
                        </div>
                      ) : null}
                    </div>

                    {clientError || submitMutation.isError ? (
                      <p className="text-sm text-red-600" role="alert">
                        {clientError ?? formatErrorMessage(submitMutation.error)}
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      className="rounded-md bg-[#E00122] text-white hover:bg-[#B8011C]"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? "Submitting…" : "Submit request"}
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
