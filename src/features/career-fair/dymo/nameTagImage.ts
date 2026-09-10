import {
  DEVICES,
  MEDIA,
  getPrintableCanvasDots,
  type PrintEngine,
  type RawImageData,
} from "@thermal-label/labelwriter-core";

const COMPANY_LABEL_URL = "/labels/Company.label";
const PRINT_DPI = 300;
const TWIPS_PER_INCH = 1440;
const MIN_FONT_PX = 8;

let cachedLabelXml: string | null = null;

function twipsToPx(twips: number): number {
  return (twips * PRINT_DPI) / TWIPS_PER_INCH;
}

function ptToPx(pt: number): number {
  return (pt * PRINT_DPI) / 72;
}

function attrNumber(el: Element | null, name: string): number {
  if (!el) return 0;
  return Number(el.getAttribute(name) ?? 0);
}

function parseBounds(info: Element): { x: number; y: number; width: number; height: number } {
  const bounds = info.querySelector("Bounds");
  return {
    x: twipsToPx(attrNumber(bounds, "X")),
    y: twipsToPx(attrNumber(bounds, "Y")),
    width: twipsToPx(attrNumber(bounds, "Width")),
    height: twipsToPx(attrNumber(bounds, "Height")),
  };
}

/**
 * Company.label stores the die-cut in portrait twips and object Bounds
 * in the landscape design space (PaperOrientation = Landscape).
 */
function nativeCanvasSize(doc: Document): { width: number; height: number } {
  const rect = doc.querySelector("DrawCommands RoundRectangle");
  const paperW = twipsToPx(attrNumber(rect, "Width"));
  const paperH = twipsToPx(attrNumber(rect, "Height"));
  const landscape =
    (doc.querySelector("PaperOrientation")?.textContent ?? "").trim() === "Landscape";
  if (landscape) {
    return { width: Math.max(paperW, paperH), height: Math.min(paperW, paperH) };
  }
  return { width: paperW, height: paperH };
}

function fallbackEngine(): PrintEngine {
  const engine = DEVICES.LW_450_TURBO.engines[0];
  if (engine) return engine;
  const any450 = DEVICES.LW_450.engines[0];
  if (any450) return any450;
  throw new Error("No LabelWriter engine is available to size Company.label.");
}

/**
 * Landscape bitmap that pickRotation will turn 90° for 57×102 mm name badges.
 * Width = printable feed length (label pitch minus leading dead zone);
 * height = printable cross-feed dots.
 */
function printerLandscapeSize(engine: PrintEngine): { width: number; height: number } {
  const dots = getPrintableCanvasDots(engine, MEDIA.NAME_BADGE);
  const labelLengthDots = MEDIA.NAME_BADGE.lengthDots ?? 1205;
  const shortSideDots = Math.round((MEDIA.NAME_BADGE.widthMm * PRINT_DPI) / 25.4);
  const printableLength = Math.max(
    1,
    labelLengthDots - dots.leadingDots - dots.trailingDots
  );
  return {
    width: printableLength,
    height: Math.min(dots.widthDots, shortSideDots),
  };
}

function applyTextAlign(
  ctx: CanvasRenderingContext2D,
  hAlign: string,
  vAlign: string
): void {
  if (hAlign === "Center") ctx.textAlign = "center";
  else if (hAlign === "Right") ctx.textAlign = "right";
  else ctx.textAlign = "left";

  if (vAlign === "Top") ctx.textBaseline = "top";
  else if (vAlign === "Bottom") ctx.textBaseline = "bottom";
  else ctx.textBaseline = "middle";
}

function textFits(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number
): boolean {
  const width = ctx.measureText(text).width;
  if (width > maxWidth) return false;
  const metrics = ctx.measureText(text);
  const glyphHeight =
    (metrics.actualBoundingBoxAscent ?? 0) + (metrics.actualBoundingBoxDescent ?? 0);
  if (glyphHeight === 0) return true;
  return glyphHeight <= maxHeight;
}

function setFittedFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: { width: number; height: number },
  font: { family: string; weight: string; sizePx: number; shrink: boolean }
): void {
  let size = font.sizePx;
  ctx.font = `${font.weight} ${size}px "${font.family}"`;
  if (!font.shrink) return;
  while (size > MIN_FONT_PX && !textFits(ctx, text, box.width, box.height)) {
    size -= 0.5;
    ctx.font = `${font.weight} ${size}px "${font.family}"`;
  }
}

function textOriginX(
  box: { x: number; width: number },
  hAlign: string
): number {
  if (hAlign === "Center") return box.x + box.width / 2;
  if (hAlign === "Right") return box.x + box.width;
  return box.x;
}

function textOriginY(
  box: { y: number; height: number },
  vAlign: string
): number {
  if (vAlign === "Top") return box.y;
  if (vAlign === "Bottom") return box.y + box.height;
  return box.y + box.height / 2;
}

function drawLabelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  info: Element
): void {
  const box = parseBounds(info);
  const fontEl = info.querySelector("Font");
  const family = fontEl?.getAttribute("Family") || "Arial";
  const bold = fontEl?.getAttribute("Bold") === "True";
  const sizePx = ptToPx(attrNumber(fontEl, "Size"));
  const shrink = info.querySelector("TextFitMode")?.textContent?.trim() === "ShrinkToFit";
  const vAlign = (info.querySelector("VerticalAlignment")?.textContent ?? "Middle").trim();
  const hAlign = (info.querySelector("HorizontalAlignment")?.textContent ?? "Left").trim();
  const weight = bold ? "bold" : "normal";

  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.clip();
  ctx.fillStyle = "#000000";
  applyTextAlign(ctx, hAlign, vAlign);
  setFittedFont(ctx, text, box, { family, weight, sizePx, shrink });
  ctx.fillText(text, textOriginX(box, hAlign), textOriginY(box, vAlign));
  ctx.restore();
}

function drawHorizontalLine(ctx: CanvasRenderingContext2D, info: Element): void {
  const box = parseBounds(info);
  const lineWidthTwips = Number(info.querySelector("LineWidth")?.textContent ?? 0);
  const thickness = Math.max(box.height, twipsToPx(lineWidthTwips), 1);
  ctx.fillStyle = "#000000";
  ctx.fillRect(box.x, box.y + (box.height - thickness) / 2, box.width, thickness);
}

function fieldText(
  fields: { name: string; company: string; title: string },
  objectName: string
): string | null {
  if (objectName === "name") return fields.name;
  if (objectName === "company") return fields.company;
  if (objectName === "title") return fields.title;
  return null;
}

function drawCompanyLabel(
  ctx: CanvasRenderingContext2D,
  doc: Document,
  fields: { name: string; company: string; title: string }
): void {
  for (const info of Array.from(doc.querySelectorAll("ObjectInfo"))) {
    const textObject = info.querySelector("TextObject");
    if (textObject) {
      const objectName = textObject.querySelector("Name")?.textContent?.trim() ?? "";
      const value = fieldText(fields, objectName);
      if (value !== null) drawLabelText(ctx, value, info);
      continue;
    }
    const shape = info.querySelector("ShapeObject");
    if (shape?.querySelector("ShapeType")?.textContent?.trim() === "HorizontalLine") {
      drawHorizontalLine(ctx, info);
    }
  }
}

async function loadCompanyLabelXml(): Promise<string> {
  if (cachedLabelXml !== null) return cachedLabelXml;
  const response = await fetch(`${COMPANY_LABEL_URL}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load Company.label.");
  }
  cachedLabelXml = await response.text();
  return cachedLabelXml;
}

/**
 * Raster Company.label (57×102 mm name badge) into a landscape bitmap the
 * LabelWriter driver rotates onto the print head.
 *
 * Always scales with contain + clips to the printable canvas so nothing
 * can paint outside the badge.
 */
export async function renderNameTagImage(
  fields: { name: string; company: string; title: string },
  engine: PrintEngine = fallbackEngine()
): Promise<RawImageData> {
  const xml = await loadCompanyLabelXml();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Company.label is not valid XML.");
  }

  const native = nativeCanvasSize(doc);
  const { width, height } = printerLandscapeSize(engine);
  const scale = Math.min(width / native.width, height / native.height);
  const offsetX = Math.round((width - native.width * scale) / 2);
  const offsetY = Math.round((height - native.height * scale) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create a canvas to render Company.label.");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.clip();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.beginPath();
  ctx.rect(0, 0, native.width, native.height);
  ctx.clip();
  drawCompanyLabel(ctx, doc, fields);
  ctx.restore();

  const image = ctx.getImageData(0, 0, width, height);
  return {
    width,
    height,
    data: new Uint8Array(image.data),
  };
}
