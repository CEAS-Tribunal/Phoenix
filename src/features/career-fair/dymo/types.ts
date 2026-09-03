export interface DymoPrinter {
  name: string;
  modelName: string;
  printerType: string;
  isConnected: boolean;
  isLocal: boolean;
}

export interface DymoPrinterCollection {
  length: number;
  [index: number]: DymoPrinter | undefined;
}

export interface DymoLabel {
  getLabelXml(): string;
}

export interface DymoLabelSetRecord {
  setText(objectName: string, text: string): DymoLabelSetRecord;
}

export interface DymoLabelSetBuilder {
  addRecord(): DymoLabelSetRecord;
  toString(): string;
}

export interface DymoFramework {
  init: (callback?: () => void) => void | Promise<void>;
  getPrinters: () => DymoPrinterCollection;
  getPrintersAsync?: () => Promise<DymoPrinterCollection>;
  openLabelFile: (uri: string) => DymoLabel;
  openLabelXml: (xml: string) => DymoLabel;
  createLabelWriterPrintParamsXml: (params: { copies?: number }) => string;
  printLabel2Async: (
    printerName: string,
    printParamsXml: string,
    labelXml: string,
    labelSetXml: string | DymoLabelSetBuilder
  ) => Promise<unknown>;
  LabelSetBuilder: new () => DymoLabelSetBuilder;
}

declare global {
  interface Window {
    dymo?: {
      label: {
        framework: DymoFramework;
      };
    };
  }
}

export {};
