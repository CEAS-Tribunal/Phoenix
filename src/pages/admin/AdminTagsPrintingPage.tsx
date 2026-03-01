import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PRINTER_OPTIONS = [
  { value: "dymo-450", label: "DYMO LabelWriter 450" },
  { value: "none", label: "No printer detected" },
] as const;

const LOCATIONS = [
  { value: "booth-a1", label: "Booth A1" },
  { value: "booth-a2", label: "Booth A2" },
  { value: "main-hall", label: "Main Hall" },
  { value: "virtual", label: "Virtual" },
] as const;

const PLACEHOLDER_REPRESENTATIVES = [
  { name: "Jane Smith", company: "Acme Corp", title: "Recruiter", booth: "A1", timeAdded: "9:15 AM" },
  { name: "John Doe", company: "Tech Inc", title: "HR Manager", booth: "A2", timeAdded: "9:22 AM" },
  { name: "Alex Johnson", company: "Engineering Co", title: "Campus Lead", booth: "Main Hall", timeAdded: "9:30 AM" },
  { name: "Sam Williams", company: "Design Studio", title: "Talent Lead", booth: "A1", timeAdded: "9:45 AM" },
  { name: "Jordan Lee", company: "Startup Labs", title: "Recruiter", booth: "Virtual", timeAdded: "10:00 AM" },
];

export default function AdminTagsPrintingPage() {
  const [printer, setPrinter] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  function handlePrint() {
    // Placeholder: could call window.print() for demo
    alert("Print tags (placeholder — no printer integration).");
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
                    <Printer className="h-6 w-6" />
                    <CardTitle className="text-2xl">Printing Station</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Select a DYMO printer and location, then print name tags for representatives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Printer Settings */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Printer Settings
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Select a connected DYMO printer</Label>
                        <Select value={printer} onValueChange={setPrinter}>
                          <SelectTrigger className="w-full border-gray-200">
                            <SelectValue placeholder="Select printer" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRINTER_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Select Location</Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="w-full border-gray-200">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATIONS.map((loc) => (
                              <SelectItem key={loc.value} value={loc.value}>
                                {loc.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Representatives Table */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Representatives
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Company
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Title
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Booth Location
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Time Added
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLACEHOLDER_REPRESENTATIVES.map((rep, i) => (
                            <tr
                              key={i}
                              className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                            >
                              <td className="px-4 py-3 text-gray-700">{rep.name}</td>
                              <td className="px-4 py-3 text-gray-700">{rep.company}</td>
                              <td className="px-4 py-3 text-gray-700">{rep.title}</td>
                              <td className="px-4 py-3 text-gray-700">{rep.booth}</td>
                              <td className="px-4 py-3 text-gray-600">{rep.timeAdded}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      type="button"
                      onClick={handlePrint}
                      className="bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
                    >
                      Print tags
                    </Button>
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
