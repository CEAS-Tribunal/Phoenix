import { getDymoFramework, initDymoFramework } from "./framework";
import type { DymoFramework, DymoLabel, DymoPrinter, DymoPrinterCollection } from "./types";

const COMPANY_LABEL_PATH = "/labels/Company.label";

let readyPromise: Promise<void> | null = null;
let cachedLabel: DymoLabel | null = null;
let cachedParamsXml: string | null = null;

function printersToArray(printers: DymoPrinterCollection): DymoPrinter[] {
  return Array.from({ length: printers.length }, (_, index) => printers[index]).filter(
    (printer): printer is DymoPrinter => printer != null
  );
}

async function readPrinters(fw: DymoFramework): Promise<DymoPrinter[]> {
  if (typeof fw.getPrintersAsync === "function") {
    return printersToArray(await fw.getPrintersAsync());
  }
  return printersToArray(fw.getPrinters());
}

async function loadCompanyLabel(fw: DymoFramework): Promise<DymoLabel> {
  const labelUri = `${window.location.origin}${COMPANY_LABEL_PATH}`;
  try {
    const fromFile = fw.openLabelFile(labelUri);
    if (fromFile?.getLabelXml()) return fromFile;
  } catch {
    // DYMO Connect OpenLabelFile expects a local path; fetch XML instead.
  }

  const response = await fetch(labelUri);
  if (!response.ok) {
    throw new Error("Could not load the Company.label template.");
  }
  return fw.openLabelXml(await response.text());
}

async function ensureDymoReady(): Promise<void> {
  if (cachedLabel !== null && cachedParamsXml !== null) return;
  if (readyPromise !== null) return readyPromise;

  readyPromise = (async () => {
    await initDymoFramework();
    const fw = getDymoFramework();
    cachedLabel = await loadCompanyLabel(fw);
    cachedParamsXml = fw.createLabelWriterPrintParamsXml({ copies: 1 });
  })().catch((err) => {
    readyPromise = null;
    throw err;
  });

  return readyPromise;
}

/** Connected DYMO printers, matching the legacy getConnectedPrinter() filter. */
export async function getConnectedPrinters(): Promise<DymoPrinter[]> {
  await ensureDymoReady();
  const printers = await readPrinters(getDymoFramework());
  return printers.filter((printer) => printer.isConnected === true);
}

export function pickDefaultPrinter(printers: DymoPrinter[], current: string): string {
  if (current && printers.some((printer) => printer.name === current)) {
    return current;
  }
  const turbo = printers.find((printer) =>
    /labelwriter\s*450\s*turbo/i.test(`${printer.name} ${printer.modelName}`)
  );
  if (turbo) return turbo.name;
  const only = printers.length === 1 ? printers[0] : undefined;
  return only?.name ?? "";
}

/**
 * Legacy checkPrinterStatus: require a selected, connected printer.
 * Returns an error message, or null when printing may proceed.
 */
export function checkPrinterStatus(
  printerSelected: string,
  printers: DymoPrinter[]
): string | null {
  if (!printerSelected) {
    return "Please select a printer before continuing.";
  }
  const selected = printers.find((printer) => printer.name === printerSelected);
  if (selected?.isConnected === true) {
    return null;
  }
  return "DYMO LabelWriter is not connected. Please connect the printer to continue.";
}

/**
 * Print one name tag via DYMO Connect (LabelWriter 450 Turbo), using the same
 * LabelSetBuilder fields as the legacy admin station: name, company, title.
 */
export async function printNameTag(
  printerSelected: string,
  name: string,
  company: string,
  title: string
): Promise<void> {
  await ensureDymoReady();
  const fw = getDymoFramework();
  const label = cachedLabel;
  const paramsXml = cachedParamsXml;
  if (!label || !paramsXml) {
    throw new Error("Name tag template is not loaded.");
  }

  const labelSetXml = new fw.LabelSetBuilder();
  const record = labelSetXml.addRecord();
  record.setText("name", name);
  record.setText("company", company);
  record.setText("title", title);

  await fw.printLabel2Async(
    printerSelected,
    paramsXml,
    label.getLabelXml(),
    labelSetXml
  );
}
