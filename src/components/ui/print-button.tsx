"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-fg hover:bg-bg-muted"
    >
      <Printer className="size-4" aria-hidden /> Imprimer ou enregistrer en PDF
    </button>
  );
}
