import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Receipt, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  formatErrorMessage,
  getCachedUsername,
  logout,
  refreshMe,
  type AuthMeResponse,
} from "@/services/AuthService";
import { submitReimbursementRequest } from "@/services/ReimbursementService";
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
  const [expenditureDate, setExpenditureDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [budgeted, setBudgeted] = useState<string>("");
  const [reimbursementMethod, setReimbursementMethod] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fileInputsKey, setFileInputsKey] = useState(0);

  const meQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: refreshMe,
  });

  const submitMutation = useMutation({
    mutationFn: submitReimbursementRequest,
    onSuccess: () => {
      setExpenditureDate("");
      setVendorName("");
      setAmount("");
      setDescription("");
      setBudgeted("");
      setReimbursementMethod("");
      setReceiptFile(null);
      setSupportingFile(null);
      setClientError(null);
      setFileInputsKey((k) => k + 1);
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
    if (!reimbursementMethod) {
      setClientError("Please choose how you would like to be reimbursed.");
      return;
    }
    if (!receiptFile) {
      setClientError("An itemized receipt is required.");
      return;
    }
    submitMutation.mutate({
      date: expenditureDate.trim(),
      vendorName: vendorName.trim(),
      amount: amountParsed.toFixed(2),
      description: description.trim(),
      budgeted: budgeted === "yes",
      reimbursementType: reimbursementMethod as "direct-deposit" | "check",
      itemizedReceipt: receiptFile,
      supportingDocument: supportingFile,
    });
  }

  function handleSignOut() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const me = meQuery.data;
  const displayName = me
    ? displayNameFromMe(me)
    : (getCachedUsername() ?? "your account");

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
                    <p className="text-sm text-gray-600 -mt-2">
                      Your name, email, executive role, vendor ID, and M number are taken from your
                      account and treasurer records—you only need to complete the sections below.
                    </p>

                    {/* Expenditure Information — purchase details (design: underline fields) */}
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

                    {/* Budget & reimbursement */}
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
                    </div>

                    {/* Supporting Documents */}
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
                    {submitMutation.isSuccess && (
                      <p className="text-sm text-green-700" role="status">
                        Request submitted successfully. You will receive reimbursement within two
                        weeks.
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
