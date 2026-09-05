import type { DymoFramework } from "./types";

const FRAMEWORK_SRC = "./dymo/DYMO.Label.Framework.3.0.js";

let loadPromise: Promise<void> | null = null;

export function getDymoFramework(): DymoFramework {
  const fw = window.dymo?.label?.framework;
  if (!fw) {
    throw new Error("DYMO Label Framework is not loaded.");
  }
  return fw;
}

export function loadDymoFramework(): Promise<void> {
  if (window.dymo?.label?.framework) {
    return Promise.resolve();
  }
  if (loadPromise !== null) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = FRAMEWORK_SRC;
    script.async = true;
    script.onload = () => {
      if (window.dymo?.label?.framework) {
        resolve();
        return;
      }
      loadPromise = null;
      reject(new Error("DYMO Label Framework failed to initialize."));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(
        new Error(
          "Failed to load the DYMO Connect framework. Confirm DYMO Connect is installed."
        )
      );
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function initDymoFramework(): Promise<void> {
  await loadDymoFramework();
  const fw = getDymoFramework();
  if (typeof fw.init !== "function") return;

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const timeoutId = window.setTimeout(() => {
      finishErr(
        new Error(
          "DYMO Connect did not respond. Open https://127.0.0.1:41951 in this browser to trust the printer service, then refresh printers."
        )
      );
    }, 12000);

    const finishOk = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };

    const finishErr = (err: unknown) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      reject(err);
    };

    try {
      const result = fw.init(finishOk);
      if (typeof result === "object" && result !== null && "then" in result) {
        result.then(finishOk, finishErr);
      }
    } catch (err) {
      finishErr(err);
    }
  });
}
