import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

/** État renvoyé par les actions serveur des formulaires simples. */
export type FormState = { error?: string; success?: string; fields?: Record<string, string> };

export const inputClass =
  "mt-1.5 block w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-fg shadow-sm outline-none transition placeholder:text-fg-subtle focus:border-brand focus:ring-4 focus:ring-[var(--ring)]";

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="flex items-start gap-2 rounded-lg bg-success-soft px-3 py-2.5 text-sm text-success">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        {state.success}
      </p>
    );
  }
  return null;
}

export function SubmitButton({
  pending,
  children,
  tone = "brand",
  full = false,
}: {
  pending: boolean;
  children: ReactNode;
  tone?: "brand" | "danger";
  full?: boolean;
}) {
  const colors = tone === "danger" ? "bg-danger text-white hover:opacity-90" : "bg-brand text-brand-fg hover:bg-brand-strong";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-60 ${colors} ${full ? "w-full" : ""}`}
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
