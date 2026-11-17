"use client";

import type { ReactNode } from "react";
import { Printer } from "lucide-react";

export function PrintButton({
  children,
  icon = <Printer className="size-4" aria-hidden />,
  className = "inline-flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-fg hover:bg-bg-muted",
}: {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {icon} {children ?? "Imprimer ou enregistrer en PDF"}
    </button>
  );
}
