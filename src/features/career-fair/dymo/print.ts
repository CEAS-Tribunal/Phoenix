import { DEFAULT_FILTERS, fromUSBDevice } from "@thermal-label/labelwriter-web";
import { MEDIA } from "@thermal-label/labelwriter-core";

import { renderNameTagImage } from "./nameTagImage";
import type { UsbLabelPrinter } from "./types";

function assertWebUsb(): void {
  if (typeof navigator === "undefined" || !("usb" in navigator)) {
    throw new Error(
      "WebUSB is not available. Use Chrome or Edge on https:// or localhost."
    );
  }
}

function isLabelWriterDevice(device: USBDevice): boolean {
  return DEFAULT_FILTERS.some(
    (filter) =>
      filter.vendorId === device.vendorId &&
      (filter.productId === undefined || filter.productId === device.productId)
  );
}

export function usbPrinterId(device: USBDevice): string {
  const serial = device.serialNumber || device.productName || "usb";
  return `${device.vendorId}:${device.productId}:${serial}`;
}

function toUsbPrinter(device: USBDevice): UsbLabelPrinter {
  const name = device.productName?.trim() || "DYMO LabelWriter";
  return {
    id: usbPrinterId(device),
    name,
    modelName: name,
    isConnected: true,
  };
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown USB error";
}

function isUsbClaimError(err: unknown): boolean {
  return /claimInterface|Unable to claim interface/i.test(errorMessage(err));
}

function usbClaimError(): Error {
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua)) {
    return new Error(
      "Unable to claim the USB printer. Quit DYMO Connect and DYMO Label, remove the LabelWriter from System Settings → Printers & Scanners, then unplug and replug the USB cable and click Connect USB again."
    );
  }
  if (/Linux/i.test(ua)) {
    return new Error(
      "Unable to claim the USB printer. Linux usblp/CUPS likely has it. Quit DYMO software, add a udev rule for VID 0922 with TAG+=uaccess, then unplug and replug the printer."
    );
  }
  return new Error(
    "Unable to claim the USB printer. Quit DYMO Connect and any app using the LabelWriter, then unplug and replug the USB cable and try again."
  );
}

async function releaseUsbDevice(device: USBDevice): Promise<void> {
  if (!device.opened) return;
  const interfaces = device.configuration?.interfaces ?? [];
  for (const iface of interfaces) {
    if (!iface.claimed) continue;
    try {
      await device.releaseInterface(iface.interfaceNumber);
    } catch {
      // This page may not own the claim.
    }
  }
  try {
    await device.close();
  } catch {
    // Already closed.
  }
}

async function resetUsbDevice(device: USBDevice): Promise<void> {
  try {
    if (!device.opened) await device.open();
    await device.reset();
  } catch {
    // Reset is not always permitted; release still helps the next claim.
  }
  await releaseUsbDevice(device);
}

async function openUsbAdapter(device: USBDevice) {
  await releaseUsbDevice(device);
  try {
    return await fromUSBDevice(device);
  } catch (openError) {
    await releaseUsbDevice(device);
    if (!isUsbClaimError(openError)) throw openError;
    await resetUsbDevice(device);
    try {
      return await fromUSBDevice(device);
    } catch (retryError) {
      await releaseUsbDevice(device);
      if (isUsbClaimError(retryError)) throw usbClaimError();
      throw retryError;
    }
  }
}

export function isWebUsbSupported(): boolean {
  return typeof navigator !== "undefined" && "usb" in navigator;
}

/** Already-authorized LabelWriter devices (no USB picker). */
export async function listPairedPrinters(): Promise<UsbLabelPrinter[]> {
  assertWebUsb();
  const devices = await navigator.usb.getDevices();
  return devices.filter(isLabelWriterDevice).map(toUsbPrinter);
}

/**
 * Opens the browser USB picker (must run from a click). Grants WebUSB
 * permission only — does not claim the interface until Print.
 */
export async function pairUsbPrinter(): Promise<UsbLabelPrinter[]> {
  assertWebUsb();
  await navigator.usb.requestDevice({ filters: DEFAULT_FILTERS });
  return listPairedPrinters();
}

export function pickDefaultPrinter(printers: UsbLabelPrinter[], current: string): string {
  if (current && printers.some((printer) => printer.id === current)) {
    return current;
  }
  const turbo = printers.find((printer) =>
    /labelwriter\s*450\s*turbo/i.test(`${printer.name} ${printer.modelName}`)
  );
  if (turbo) return turbo.id;
  const only = printers.length === 1 ? printers[0] : undefined;
  return only?.id ?? "";
}

export function checkPrinterStatus(
  printerSelected: string,
  printers: UsbLabelPrinter[]
): string | null {
  if (!printerSelected) {
    return "Please select a printer before continuing.";
  }
  const selected = printers.find((printer) => printer.id === printerSelected);
  if (selected?.isConnected === true) {
    return null;
  }
  return "DYMO LabelWriter is not connected. Please connect the printer to continue.";
}

async function openPrinterById(printerId: string) {
  const devices = await navigator.usb.getDevices();
  const device = devices.find((candidate) => usbPrinterId(candidate) === printerId);
  if (!device) {
    throw new Error("DYMO LabelWriter is not connected. Please connect the printer to continue.");
  }
  return openUsbAdapter(device);
}

export async function printNameTag(
  printerId: string,
  name: string,
  company: string,
  title: string
): Promise<void> {
  assertWebUsb();
  const printer = await openPrinterById(printerId);
  try {
    const image = await renderNameTagImage({ name, company, title }, printer.engine);
    await printer.print(image, MEDIA.NAME_BADGE, {
      rotate: "auto",
      labelLengthDots: MEDIA.NAME_BADGE.lengthDots,
    });
  } finally {
    await printer.close();
  }
}
