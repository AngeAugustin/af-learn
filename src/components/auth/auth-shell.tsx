import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2">
        <div className="hidden lg:block">
          <h2 className="text-3xl font-bold tracking-tight text-fg">Apprenez à votre rythme, progressez pour de vrai.</h2>
          <ul className="mt-6 space-y-3 text-fg-muted">
            {[
              "Des parcours complets, organisés en modules, chapitres et sections",
              "Des illustrations claires et des exemples de code vérifiés",
              "Des exercices corrigés dans chaque chapitre",
              "Une évaluation par chapitre, validée à partir de 75 %",
              "Un suivi de progression et une attestation de fin de parcours",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-bg-elevated p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
          <p className="mt-1.5 text-sm text-fg-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
