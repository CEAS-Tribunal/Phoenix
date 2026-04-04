import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AdminReimbursementsPage() {
  const [vendorId, setVendorId] = useState("");
  const [budgeted, setBudgeted] = useState<string>("");
  const [reimbursementMethod, setReimbursementMethod] = useState<string>("");
  const [, setReceiptFile] = useState<File | null>(null);
  const [, setSupportingFile] = useState<File | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Placeholder: frontend-only submission
    alert("Reimbursement request submitted. (Placeholder — no backend.)");
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
                    {/* Member Information */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Member Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="vendor-id">Vendor ID</Label>
                        <Input
                          id="vendor-id"
                          value={vendorId}
                          onChange={(e) => setVendorId(e.target.value)}
                          placeholder="Enter your Vendor ID"
                          className="max-w-xs border-gray-200"
                        />
                        <p className="text-sm text-gray-500">
                          Don&apos;t know your Vendor ID?{" "}
                          <a
                            href="#"
                            className="text-[#E00122] hover:underline"
                            onClick={(e) => e.preventDefault()}
                          >
                            View vendor ID list
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Expenditure Information */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                        Expenditure Information
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
                          onChange={(e) => setSupportingFile(e.target.files?.[0] ?? null)}
                          className="border-gray-200 file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
                    >
                      Submit request
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
