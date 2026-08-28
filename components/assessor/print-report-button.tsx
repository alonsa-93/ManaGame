"use client";

import { Printer } from "lucide-react";

/**
 * PDF export via the browser's own print dialogue ("Save as PDF").
 *
 * Deliberately not a PDF library. A server-side renderer would mean shipping a
 * headless browser or a PDF toolkit into the bundle, and then maintaining a
 * second layout that drifts from the real report. Printing the actual page
 * means the PDF is the report — same content, same evidence, no second source
 * of truth to keep in sync. The print stylesheet in app/globals.css handles
 * page breaks and drops the interface chrome.
 */
export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden shrink-0 flex items-center gap-1.5 rounded-mg-md border border-mg-border bg-white px-3 py-2 text-sm text-mg-text-secondary hover:text-mg-text hover:border-mg-teal transition-colors"
    >
      <Printer className="h-4 w-4" aria-hidden />
      ייצוא ל-PDF
    </button>
  );
}
