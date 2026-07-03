import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Receipt, Table2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  formatErrorMessage,
  getCachedUsername,
  getIsTreasurerUser,
  logoutWithQueryClient,
  type AuthMeResponse,
} from "@/services/AuthService";
import { useAuthMe } from "@/hooks/useAuthMe";
import { committeesKeys, reimbursementKeys } from "@/services/queryKeys";
import { submitReimbursementRequest } from "@/services/ReimbursementService";
import { CommitteesService } from "@/services/CommitteesService";
import { cn } from "@/lib/utils";

/** Underline-only row: outer wrapper supplies `border-b`; inner kills default Input chrome. */
const minimalInputClass = cn(
  "w-full border-0 rounded-none bg-transparent px-0 py-2 shadow-none h-auto min-h-9 text-base md:text-base",
  "placeholder:text-gray-400 text-gray-900",
  "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent focus-visible:outline-none"
);

function displayNameFromMe(me: AuthMeResponse): string {
  const full = `${me.first_name} ${me.last_name}`.trim();
  return full || me.username;
}

export default function AdminReimbursementsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const [icCompetition, setIcCompetition] = useState(false);
  const [icParticipantName, setIcParticipantName] = useState("");
  const [icParticipantRole, setIcParticipantRole] = useState("");
  const [icParticipantEmail, setIcParticipantEmail] = useState("");
  const [expenditureDate, setExpenditureDate] = useState("");
  const [mNumber, setMNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [budgeted, setBudgeted] = useState<string>("");
  const [nonBudgetedOfficerName, setNonBudgetedOfficerName] = useState("");
  const [nonBudgetedOfficerPosition, setNonBudgetedOfficerPosition] = useState("");
  const [reimbursementMethod, setReimbursementMethod] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fileInputsKey, setFileInputsKey] = useState(0);

  const meQuery = useAuthMe();

  const execRolesQuery = useQuery({
    queryKey: committeesKeys.execRoleWithMembers,
    queryFn: () => CommitteesService.getExecRoleSectionsWithMembers(),
  });

  const submitMutation = useMutation({
    mutationFn: submitReimbursementRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reimbursementKeys.all });
      setIcCompetition(false);
      setIcParticipantName("");
      setIcParticipantRole("");
      setIcParticipantEmail("");
      setExpenditureDate("");
      setMNumber("");
      setVendorName("");
      setAmount("");
      setDescription("");
      setBudgeted("");
      setNonBudgetedOfficerName("");
      setNonBudgetedOfficerPosition("");
      setReimbursementMethod("");
      setAddressLine1("");
      setAddressLine2("");
      setAddressCity("");
      setAddressState("");
      setAddressZip("");
      setReceiptFile(null);
      setSupportingFile(null);
      setClientError(null);
      setFileInputsKey((k) => k + 1);
      setSuccessOpen(true);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setClientError(null);
    submitMutation.reset();
    if (!expenditureDate.trim()) {
      setClientError("Please enter the date of the expenditure.");
      return;
    }
    if (!mNumber.trim()) {
      setClientError("Please enter your M number.");
      return;
    }
    if (!vendorName.trim()) {
      setClientError("Please enter the vendor name.");
      return;
    }
    const amountParsed = Number.parseFloat(amount);
    if (!amount.trim() || Number.isNaN(amountParsed) || amountParsed < 0.01) {
      setClientError("Please enter a valid amount (at least 0.01).");
      return;
    }
    if (!description.trim()) {
      setClientError("Please enter a short description of the expense.");
      return;
    }
    if (!budgeted) {
      setClientError("Please indicate whether this was a budgeted expense.");
      return;
    }
    if (budgeted === "no") {
      if (!nonBudgetedOfficerName.trim()) {
        setClientError("Please enter the officer name for this non-budgeted expense.");
        return;
      }
      if (!nonBudgetedOfficerPosition.trim()) {
        setClientError("Please enter the officer position for this non-budgeted expense.");
        return;
      }
    }
    if (!reimbursementMethod) {
      setClientError("Please choose how you would like to be reimbursed.");
      return;
    }
    if (reimbursementMethod === "check") {
      if (!addressLine1.trim() || !addressCity.trim() || !addressState.trim() || !addressZip.trim()) {
        setClientError("Please enter your mailing address for check reimbursements.");
        return;
      }
    }
    if (icCompetition) {
      if (!icParticipantName.trim()) {
        setClientError("Please enter the IC participant name.");
        return;
      }
      if (!icParticipantRole.trim()) {
        setClientError("Please enter the IC participant role.");
        return;
      }
      if (!icParticipantEmail.trim()) {
        setClientError("Please enter the IC participant email.");
        return;
      }
    }
    if (!receiptFile) {
      setClientError("An itemized receipt is required.");
      return;
    }
    submitMutation.mutate({
      date: expenditureDate.trim(),
      mNumber: mNumber.trim(),
      vendorName: vendorName.trim(),
      amount: amountParsed.toFixed(2),
      description: description.trim(),
      budgeted: budgeted === "yes",
      nonBudgetedOfficerName: budgeted === "no" ? nonBudgetedOfficerName.trim() : undefined,
      nonBudgetedOfficerPosition: budgeted === "no" ? nonBudgetedOfficerPosition.trim() : undefined,
      reimbursementType: reimbursementMethod as "direct-deposit" | "check",
      reimbursementAddressLine1: reimbursementMethod === "check" ? addressLine1.trim() : undefined,
      reimbursementAddressLine2: reimbursementMethod === "check" ? addressLine2.trim() : undefined,
      reimbursementAddressCity: reimbursementMethod === "check" ? addressCity.trim() : undefined,
      reimbursementAddressState: reimbursementMethod === "check" ? addressState.trim() : undefined,
      reimbursementAddressZip: reimbursementMethod === "check" ? addressZip.trim() : undefined,
      icCompetition,
      icParticipantName: icCompetition ? icParticipantName.trim() : undefined,
      icParticipantRole: icCompetition ? icParticipantRole.trim() : undefined,
      icParticipantEmail: icCompetition ? icParticipantEmail.trim() : undefined,
      itemizedReceipt: receiptFile,
      supportingDocument: supportingFile,
    });
  }

  function handleSignOut() {
    logoutWithQueryClient(queryClient);
    navigate("/admin/login", { replace: true });
  }

  const me = meQuery.data;
  const displayName = me
    ? displayNameFromMe(me)
    : (getCachedUsername() ?? "your account");
  const isTreasurer = (me?.is_treasurer ?? getIsTreasurerUser()) === true;

  const canUseIcToggle = useMemo(() => {
    const email = (me?.email ?? "").trim().toLowerCase();
    if (!email) return false;
    const sections = execRolesQuery.data ?? [];
    const roles = sections.flatMap((s) => s.roles ?? []);
    return roles.some((r) => {
      const roleName = (r.role ?? "").toLowerCase();
      const isIcRole = roleName.includes("innovation") || roleName.includes("challenge");
      if (!isIcRole) return false;
      const members = r.members ?? [];
      return members.some((m) => (m.email ?? "").trim().toLowerCase() === email);
    });
  }, [execRolesQuery.data, me?.email]);

  useEffect(() => {
    if (!canUseIcToggle && icCompetition) {
      setIcCompetition(false);
      setIcParticipantName("");
      setIcParticipantRole("");
      setIcParticipantEmail("");
    }
  }, [canUseIcToggle, icCompetition]);

  useEffect(() => {
    if (reimbursementMethod !== "check") {
      setAddressLine1("");
      setAddressLine2("");
      setAddressCity("");
      setAddressState("");
      setAddressZip("");
    }
  }, [reimbursementMethod]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        {successOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Reimbursement request submitted"
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
                    Reimbursement request sent
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
                  Your request was submitted successfully. You should receive reimbursement within two
                  weeks.
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

        <section className="py-16 lg:py-24">
          <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {isTreasurer ? (
                  <>
                    <span className="hidden text-gray-300 sm:inline" aria-hidden>
                      |
                    </span>
                    <Link
                      to="/admin/reimbursements/requests"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E00122] hover:underline"
                    >
                      <Table2 className="h-4 w-4" />
                      Treasurer: reimbursement requests
                    </Link>
                  </>
                ) : null}
              </div>

              <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {meQuery.isPending ? (
                  <p>Loading your account…</p>
                ) : (
                  <p>
                    You&apos;re signed in as{" "}
                    <span className="font-medium text-gray-900">{displayName}</span>
                    {me?.email ? (
                      <span className="text-gray-500"> ({me.email})</span>
                    ) : null}
                    . Requests are tied to this account. To use a different one,{" "}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="font-medium text-[#E00122] underline-offset-2 hover:underline"
                    >
                      sign out
                    </button>{" "}
                    and log in again.
                  </p>
                )}
              </div>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 text-[#E00122]">
                    <Receipt className="h-6 w-6" />
                    <CardTitle className="text-2xl">Reimbursement Request Form</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Please fill out this form with your purchase information. You must provide an
                    itemized receipt to back up your request. You will receive reimbursement within
                    2 weeks. If you need assistance, email our treasurer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {canUseIcToggle ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-slate-50/60 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            IC competition reimbursement?
                          </p>
                          <p className="text-xs text-gray-600">
                            Toggle on to provide participant details for IC reimbursements.
                          </p>
                        </div>
                        <Switch
                          checked={icCompetition}
                          onCheckedChange={setIcCompetition}
                          className="data-[state=checked]:bg-[#E00122]"
                        />
                      </div>
                    ) : null}

                    {icCompetition ? (
                      <div className="space-y-6 max-w-xl">
                        <h3 className="text-center text-sm font-normal text-gray-500 tracking-wide">
                          IC Participant Information
                        </h3>
                        <div className="space-y-5">
                          <div className="pb-1 border-b border-gray-300">
                            <Label htmlFor="ic-name" className="sr-only">
                              Participant name
                            </Label>
                            <Input
                              id="ic-name"
                              type="text"
                              value={icParticipantName}
                              onChange={(e) => setIcParticipantName(e.target.value)}
                              placeholder="Participant name"
                              className={minimalInputClass}
                            />
                          </div>
                          <div className="pb-1 border-b border-gray-300">
                            <Label htmlFor="ic-role" className="sr-only">
                              Participant role
                            </Label>
                            <Input
                              id="ic-role"
                              type="text"
                              value={icParticipantRole}
                              onChange={(e) => setIcParticipantRole(e.target.value)}
                              placeholder="Participant role"
                              className={minimalInputClass}
                            />
                          </div>
                          <div className="pb-1 border-b border-gray-300">
                            <Label htmlFor="ic-email" className="sr-only">
                              Participant email
                            </Label>
                            <Input
                              id="ic-email"
                              type="email"
                              value={icParticipantEmail}
                              onChange={(e) => setIcParticipantEmail(e.target.value)}
                              placeholder="Participant email"
                              autoComplete="email"
                              className={minimalInputClass}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <p className="text-sm text-gray-600 -mt-2">
                      Your name, email, executive role, and vendor ID are taken from your account
                      and treasurer records. Enter your M number and the purchase details below.
                    </p>

                    <div className="space-y-6 max-w-xl">
                      <h3 className="text-center text-sm font-normal text-gray-500 tracking-wide">
                        Expenditure Information
                      </h3>
                      <div className="space-y-5">
                        <div className="relative pb-1 border-b border-gray-300">
                          <Label htmlFor="expenditure-date" className="sr-only">
                            Date of expenditure
                          </Label>
                          <Input
                            id="expenditure-date"
                            type="date"
                            value={expenditureDate}
                            onChange={(e) => setExpenditureDate(e.target.value)}
                            className={cn(minimalInputClass, "pr-10")}
                          />
                          <Calendar
                            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            aria-hidden
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="m-number" className="sr-only">
                            M number
                          </Label>
                          <Input
                            id="m-number"
                            type="text"
                            value={mNumber}
                            onChange={(e) => setMNumber(e.target.value)}
                            placeholder="M number"
                            autoComplete="off"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="vendor-name" className="sr-only">
                            Vendor
                          </Label>
                          <Input
                            id="vendor-name"
                            type="text"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            placeholder="Vendor"
                            autoComplete="organization"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="amount" className="sr-only">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className={minimalInputClass}
                          />
                        </div>
                        <div className="pb-1 border-b border-gray-300">
                          <Label htmlFor="description" className="sr-only">
                            Description
                          </Label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={2}
                            className={cn(
                              minimalInputClass,
                              "flex resize-none min-h-11 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Budget &amp; reimbursement
                      </h3>
                      <div className="space-y-3">
                        <Label>Was this a budgeted expense?</Label>
                        <RadioGroup
                          value={budgeted}
                          onValueChange={setBudgeted}
                          className="flex gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id="budgeted-yes" />
                            <Label htmlFor="budgeted-yes" className="font-normal cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="budgeted-no" />
                            <Label htmlFor="budgeted-no" className="font-normal cursor-pointer">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {budgeted === "no" ? (
                        <div className="space-y-6 max-w-xl pt-2">
                          <h3 className="text-center text-sm font-normal text-gray-500 tracking-wide">
                            Non-budgeted approval officer
                          </h3>
                          <div className="space-y-5">
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="officer-name" className="sr-only">
                                Officer name
                              </Label>
                              <Input
                                id="officer-name"
                                type="text"
                                value={nonBudgetedOfficerName}
                                onChange={(e) => setNonBudgetedOfficerName(e.target.value)}
                                placeholder="Officer name"
                                className={minimalInputClass}
                              />
                            </div>
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="officer-position" className="sr-only">
                                Officer position
                              </Label>
                              <Input
                                id="officer-position"
                                type="text"
                                value={nonBudgetedOfficerPosition}
                                onChange={(e) => setNonBudgetedOfficerPosition(e.target.value)}
                                placeholder="Officer position"
                                className={minimalInputClass}
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        <Label>How would you like to be reimbursed?</Label>
                        <RadioGroup
                          value={reimbursementMethod}
                          onValueChange={setReimbursementMethod}
                          className="flex gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="direct-deposit" id="method-direct" />
                            <Label htmlFor="method-direct" className="font-normal cursor-pointer">
                              Direct Deposit
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="check" id="method-check" />
                            <Label htmlFor="method-check" className="font-normal cursor-pointer">
                              Check
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {reimbursementMethod === "check" ? (
                        <div className="space-y-6 max-w-xl pt-2">
                          <h3 className="text-center text-sm font-normal text-gray-500 tracking-wide">
                            Reimbursement address
                          </h3>
                          <div className="space-y-5">
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="addr1" className="sr-only">
                                Address line 1
                              </Label>
                              <Input
                                id="addr1"
                                type="text"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                placeholder="Address line 1"
                                autoComplete="address-line1"
                                className={minimalInputClass}
                              />
                            </div>
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="addr2" className="sr-only">
                                Address line 2
                              </Label>
                              <Input
                                id="addr2"
                                type="text"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                                placeholder="Address line 2 (optional)"
                                autoComplete="address-line2"
                                className={minimalInputClass}
                              />
                            </div>
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="city" className="sr-only">
                                City
                              </Label>
                              <Input
                                id="city"
                                type="text"
                                value={addressCity}
                                onChange={(e) => setAddressCity(e.target.value)}
                                placeholder="City"
                                autoComplete="address-level2"
                                className={minimalInputClass}
                              />
                            </div>
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="state" className="sr-only">
                                State
                              </Label>
                              <Input
                                id="state"
                                type="text"
                                value={addressState}
                                onChange={(e) => setAddressState(e.target.value)}
                                placeholder="State"
                                autoComplete="address-level1"
                                className={minimalInputClass}
                              />
                            </div>
                            <div className="pb-1 border-b border-gray-300">
                              <Label htmlFor="zip" className="sr-only">
                                ZIP
                              </Label>
                              <Input
                                id="zip"
                                type="text"
                                value={addressZip}
                                onChange={(e) => setAddressZip(e.target.value)}
                                placeholder="ZIP"
                                autoComplete="postal-code"
                                className={minimalInputClass}
                              />
                            </div>
                            <p className="text-xs text-gray-600">
                              Mailing address is required for check reimbursements.
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Supporting Reimbursement Documents
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="receipt">Scanned Itemized Receipt (required)</Label>
                        <p className="text-sm text-gray-500">
                          The receipt must be itemized (showing each item you paid for). You can
                          take a picture or scan it.
                        </p>
                        <Input
                          id="receipt"
                          type="file"
                          accept="image/*,.pdf"
                          key={`receipt-${fileInputsKey}`}
                          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-[#E00122] file:px-3 file:py-1 file:text-white file:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supporting">Supporting Reimbursement Documents (optional)</Label>
                        <p className="text-sm text-gray-500">
                          Attach any supporting document (e.g. attendance sheet, email proof).
                          Multiple documents can be combined into one PDF.
                        </p>
                        <Input
                          id="supporting"
                          type="file"
                          accept=".pdf,image/*"
                          key={`supporting-${fileInputsKey}`}
                          onChange={(e) => setSupportingFile(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm"
                        />
                      </div>
                    </div>

                    {(clientError || submitMutation.isError) && (
                      <p className="text-sm text-red-600" role="alert">
                        {clientError ?? formatErrorMessage(submitMutation.error)}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
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
