import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Printer, ArrowLeft } from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { formatErrorMessage } from "@shared/lib/formatError";
import { careerFairKeys } from "../queryKeys";
import {
  getRepresentatives,
  type Representative,
} from "../services/careerFairService";
import {
  checkPrinterStatus,
  isWebUsbSupported,
  listPairedPrinters,
  pairUsbPrinter,
  pickDefaultPrinter,
  printNameTag,
} from "../dymo/print";
import type { UsbLabelPrinter } from "../dymo/types";

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
  onPrint: (rep: Representative) => void,
  printingId: string | null,
  printDisabled: boolean
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
          disabled={printDisabled || printingId !== null}
          onClick={() => onPrint(rep)}
        >
          {printingId === rep.id ? "Printing…" : "Print"}
        </Button>
      </td>
    </tr>
  ));
}

export default function AdminTagsPrintingPage() {
  const [printer, setPrinter] = useState<string>("");
  const [printers, setPrinters] = useState<UsbLabelPrinter[]>([]);
  const [printersLoading, setPrintersLoading] = useState(true);
  const [dymoError, setDymoError] = useState<string | null>(null);
  const [printError, setPrintError] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [pairing, setPairing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const refreshPrinters = useCallback(async () => {
    setPrintersLoading(true);
    setDymoError(null);
    if (!isWebUsbSupported()) {
      setPrinters([]);
      setPrinter("");
      setDymoError(
        "WebUSB is not available. Use Chrome or Edge on https:// or localhost."
      );
      setPrintersLoading(false);
      return;
    }
    try {
      const list = await listPairedPrinters();
      setPrinters(list);
      setPrinter((current) => pickDefaultPrinter(list, current));
      if (list.length === 0) {
        setDymoError("No printer was found. Click Connect USB printer to pair one.");
      }
    } catch (err) {
      setPrinters([]);
      setPrinter("");
      setDymoError(
        err instanceof Error ? err.message : "Could not list USB LabelWriter printers."
      );
    } finally {
      setPrintersLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPrinters();
  }, [refreshPrinters]);

  const listQuery = useQuery({
    queryKey: careerFairKeys.representativesWithSearch(debouncedSearch),
    queryFn: () => getRepresentatives(debouncedSearch || undefined),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  async function handleConnectUsb() {
    setPrintError(null);
    setDymoError(null);
    setPairing(true);
    try {
      const list = await pairUsbPrinter();
      setPrinters(list);
      setPrinter((current) => pickDefaultPrinter(list, current));
      if (list.length === 0) {
        setDymoError("No printer was found.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotFoundError") {
        setDymoError("Printer pairing was cancelled.");
        return;
      }
      setDymoError(
        err instanceof Error ? err.message : "Could not connect to the USB printer."
      );
    } finally {
      setPairing(false);
    }
  }

  async function handlePrintOne(rep: Representative) {
    setPrintError(null);
    const statusError = checkPrinterStatus(printer, printers);
    if (statusError) {
      setPrintError(statusError);
      return;
    }
    setPrintingId(rep.id);
    try {
      await printNameTag(printer, rep.name, rep.company, rep.title);
    } catch (err) {
      setPrintError(
        err instanceof Error ? err.message : "Print failed. Please try again."
      );
    } finally {
      setPrintingId(null);
    }
  }

  const listError =
    listQuery.isError && listQuery.error ? formatErrorMessage(listQuery.error) : null;
  const errorMessage = printError ?? listError;

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
                    Pair a DYMO LabelWriter over USB, search representatives, then print a
                    name tag per row.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                      Printer
                    </h3>
                    <div className="max-w-md space-y-2">
                      <Label>Select a connected DYMO printer</Label>
                      <div className="flex gap-2">
                        <Select
                          value={printer || undefined}
                          onValueChange={setPrinter}
                          disabled={printersLoading || printers.length === 0}
                        >
                          <SelectTrigger className="w-full border-gray-200">
                            <SelectValue
                              placeholder={
                                printersLoading
                                  ? "Looking for printers…"
                                  : "Select printer"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {printers.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-md shrink-0"
                          onClick={() => void handleConnectUsb()}
                          disabled={pairing || printersLoading}
                        >
                          {pairing ? "Connecting…" : "Connect USB"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-md shrink-0"
                          onClick={() => void refreshPrinters()}
                          disabled={printersLoading || pairing}
                        >
                          {printersLoading ? "Refreshing…" : "Refresh"}
                        </Button>
                      </div>
                      {dymoError && (
                        <p className="text-sm text-red-600" role="alert">
                          {dymoError}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Use Chrome or Edge on https:// or localhost. Quit DYMO Connect and
                        DYMO Label, and on a Mac remove the printer from System Settings →
                        Printers & Scanners so the browser can claim USB. Then unplug, replug,
                        and click Connect USB.
                      </p>
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
                            (rep) => void handlePrintOne(rep),
                            printingId,
                            !printer
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
