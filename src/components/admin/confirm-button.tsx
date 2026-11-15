"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/** Bouton d'envoi qui demande confirmation avant une action sensible. */
export function ConfirmButton({
  children,
  message,
  tone = "neutral",
  name,
  value,
  className = "",
}: {
  children: ReactNode;
  message?: string;
  tone?: "neutral" | "danger" | "brand";
  name?: string;
  value?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const colors = {
    neutral: "border border-border bg-bg text-fg hover:bg-bg-muted",
    danger: "border border-danger/40 bg-danger-soft text-danger hover:bg-danger hover:text-white",
    brand: "bg-brand text-brand-fg hover:bg-brand-strong",
  }[tone];
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      onClick={(e) => {
        if (message && !window.confirm(message)) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${colors} ${className}`}
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
