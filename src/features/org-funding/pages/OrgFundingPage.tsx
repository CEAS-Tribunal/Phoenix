import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Banknote,
  CalendarDays,
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
  ORG_FUNDING_CONTACT_EMAIL,
  ORG_FUNDING_PROCESS_STEPS,
} from "../data/orgFundingContent";
import {
  listOpenOrgFundingDates,
  submitOrgFundingRequest,
  type OrgFundingContact,
} from "../services/orgFundingService";
import { orgFundingKeys } from "../queryKeys";

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

type ContactDraft = OrgFundingContact & { key: string };

let contactCounter = 0;
function newContact(): ContactDraft {
  contactCounter += 1;
  return { key: `contact-${contactCounter}`, name: "", email: "", position: "" };
}

export default function OrgFundingPage() {
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [mNumber, setMNumber] = useState("");
  const [position, setPosition] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [involvesTravel, setInvolvesTravel] = useState(false);
  const [fundingDateId, setFundingDateId] = useState("");
  const [contacts, setContacts] = useState<ContactDraft[]>([]);
  const [w9File, setW9File] = useState<File | null>(null);
  const [applicationFile, setApplicationFile] = useState<File | null>(null);
  const [slidesFile, setSlidesFile] = useState<File | null>(null);
  const [travelFile, setTravelFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fileInputsKey, setFileInputsKey] = useState(0);

  // Open dates are optional: if the backend endpoint is unavailable the form still works.
  const datesQuery = useQuery({
    queryKey: orgFundingKeys.openDates(),
    queryFn: listOpenOrgFundingDates,
    retry: false,
  });
  const openDates = useMemo(() => datesQuery.data ?? [], [datesQuery.data]);

  const submitMutation = useMutation({
    mutationFn: submitOrgFundingRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orgFundingKeys.all });
      setOrganizationName("");
      setRequesterName("");
      setRequesterEmail("");
      setMNumber("");
      setPosition("");
      setRequestedAmount("");
      setPurpose("");
      setInvolvesTravel(false);
      setFundingDateId("");
      setContacts([]);
      setW9File(null);
      setApplicationFile(null);
      setSlidesFile(null);
      setTravelFile(null);
      setClientError(null);
      setFileInputsKey((k) => k + 1);
      setSuccessOpen(true);
    },
  });

  function addContact() {
    setContacts((prev) => [...prev, newContact()]);
  }

  function removeContact(key: string) {
    setContacts((prev) => prev.filter((c) => c.key !== key));
  }

  function updateContact(key: string, field: keyof OrgFundingContact, value: string) {
    setContacts((prev) =>
      prev.map((c) => (c.key === key ? { ...c, [field]: value } : c))
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
    const cleanedContacts = contacts.map((c) => ({
      name: c.name.trim(),
      email: c.email.trim(),
      position: c.position.trim(),
    }));
    for (const c of cleanedContacts) {
      if (!c.name || !c.email) {
        setClientError(
          "Each additional person needs at least a name and email, or remove the row."
        );
        return;
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
      additionalContacts: cleanedContacts,
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
        {successOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Org funding request submitted"
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
                  Your request was submitted successfully. The Org Funding chair and the
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
          </div>
        ) : null}

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
                Organization Funding
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#333333]">
                Request funding for your organization
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                CEAS Tribunal helps fund student organizations across the College of
                Engineering and Applied Science. This page replaces the back-and-forth email
                chains: submit your request and all of your documents in one place, and the
                Org Funding committee will take it from there.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Questions? Reach out at{" "}
                <a
                  href={`mailto:${ORG_FUNDING_CONTACT_EMAIL}`}
                  className="text-[#E00122] hover:underline"
                >
                  {ORG_FUNDING_CONTACT_EMAIL}
                </a>
                .
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ORG_FUNDING_PROCESS_STEPS.map((step, i) => (
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

                    {/* Additional people */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                          <Users className="h-4 w-4" />
                          Additional people to include
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1 border-[#E00122]/30 text-[#E00122] hover:bg-red-50"
                          onClick={addContact}
                        >
                          <Plus className="h-4 w-4" />
                          Add person
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Add anyone else who should be looped in on this request — for example, if
                        the president submits, they may want the treasurer included.
                      </p>
                      {contacts.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400">
                          No additional people added.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {contacts.map((c) => (
                            <div
                              key={c.key}
                              className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-slate-50/50 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
                            >
                              <Input
                                type="text"
                                value={c.name}
                                onChange={(e) => updateContact(c.key, "name", e.target.value)}
                                placeholder="Name"
                                className="bg-white"
                                aria-label="Additional person name"
                              />
                              <Input
                                type="email"
                                value={c.email}
                                onChange={(e) => updateContact(c.key, "email", e.target.value)}
                                placeholder="Email"
                                className="bg-white"
                                aria-label="Additional person email"
                              />
                              <Input
                                type="text"
                                value={c.position}
                                onChange={(e) =>
                                  updateContact(c.key, "position", e.target.value)
                                }
                                placeholder="Position (optional)"
                                className="bg-white"
                                aria-label="Additional person position"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="justify-self-start text-gray-400 hover:bg-red-50 hover:text-[#E00122] sm:justify-self-center"
                                onClick={() => removeContact(c.key)}
                                aria-label="Remove person"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                          A completed W-9 form for your organization or the payee.
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
                          The completed org funding application document.
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
