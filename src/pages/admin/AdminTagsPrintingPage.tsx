import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CAREER_FAIR_REPRESENTATIVES_QUERY_KEY,
  formatErrorMessage,
  getRepresentatives,
  type Representative,
} from "@/services/CareerFairService";

const PRINTER_OPTIONS = [
  { value: "dymo-450", label: "DYMO LabelWriter 450" },
  { value: "none", label: "No printer detected" },
] as const;

function formatSignedInAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function buildingLabel(value: string): string {
  if (value === "rec-center") return "REC Center";
  if (value === "tuc-great-hall") return "TUC Great Hall";
  return value;
}

function renderTableBody(
  isLoading: boolean,
  data: Representative[] | undefined,
  onPrint: (rep: Representative) => void
): ReactNode {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
          Loading representatives…
        </td>
      </tr>
    );
  }
  if (!data || data.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
          No representatives match this search.
        </td>
      </tr>
    );
  }
  return data.map((rep) => (
    <tr
      key={rep.id}
      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
    >
      <td className="px-4 py-3 text-gray-700">{rep.name}</td>
      <td className="px-4 py-3 text-gray-700">{rep.company}</td>
      <td className="px-4 py-3 text-gray-700">{rep.title}</td>
      <td className="px-4 py-3 text-gray-700">{rep.booth_location}</td>
      <td className="px-4 py-3 text-gray-700">{buildingLabel(rep.building_location)}</td>
      <td className="px-4 py-3 text-gray-600">{formatSignedInAt(rep.signed_in_at)}</td>
      <td className="px-4 py-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-md"
          onClick={() => onPrint(rep)}
        >
          Print
        </Button>
      </td>
    </tr>
  ));
}

export default function AdminTagsPrintingPage() {
  const [printer, setPrinter] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const listQuery = useQuery({
    queryKey: [...CAREER_FAIR_REPRESENTATIVES_QUERY_KEY, debouncedSearch],
    queryFn: () => getRepresentatives(debouncedSearch || undefined),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  function handlePrintOne(rep: Representative) {
    // DYMO integration will plug in here later
    globalThis.alert(
      `Print name tag (stub)\n\n${rep.name}\n${rep.company}\n${rep.title}\nBooth: ${rep.booth_location}\nPrinter: ${printer || "(not selected)"}`
    );
  }

  const errorMessage =
    listQuery.isError && listQuery.error ? formatErrorMessage(listQuery.error) : null;

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
                    Select a DYMO printer, search representatives, then print a name tag per row.
                    Printer integration is stubbed until DYMO is connected.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Printer
                    </h3>
                    <div className="max-w-md space-y-2">
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Representatives
                    </h3>
                    <div className="max-w-md space-y-2">
                      <Label htmlFor="rep-search">Search by name or company</Label>
                      <Input
                        id="rep-search"
                        type="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Type to filter…"
                        className="border-gray-200"
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-sm text-red-600" role="alert">
                        {errorMessage}
                      </p>
                    )}

                    <div className="max-h-[min(60vh,520px)] overflow-auto rounded-lg border border-gray-200">
                      <table className="w-full min-w-[720px] text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                          <tr className="border-b border-gray-200">
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
                              Booth
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Building
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Signed in
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-[#333333]">
                              Print
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {renderTableBody(
                            listQuery.isLoading,
                            listQuery.data,
                            handlePrintOne
                          )}
                        </tbody>
                      </table>
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
