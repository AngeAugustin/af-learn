import type { CSSProperties, ReactNode } from "react";
import { PASS_THRESHOLD } from "@/lib/quiz";

/*
 * Sketchnote du héros : la méthode Cursus dessinée à la main (Lire, Pratiquer, Valider, Débloquer).
 * Reprend les couleurs des sketchnotes de chapitre (variables --sketch-*), donc s'adapte au thème sombre.
 * Les étapes sont en ligne sur grand écran et en colonne sur mobile.
 */

const ink: CSSProperties = { stroke: "var(--sketch-ink)" };
const brand: CSSProperties = { stroke: "var(--brand)" };
const line = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Feuille de cours. */
function ReadIcon() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 sm:size-[4.5rem]" aria-hidden>
      <path d="M14 18 Q 13 6 26 6 L 54 7 Q 67 6 66 18 L 67 62 Q 67 74 54 74 L 26 73 Q 13 74 14 62 Z" {...line} style={{ ...ink, fill: "var(--sketch-paper)" }} />
      <path d="M26 22 L 54 22 M26 33 L 52 33 M26 44 L 48 44 M26 55 L 40 55" {...line} style={ink} />
    </svg>
  );
}

/** Terminal : exercices pratiques. */
function PracticeIcon() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 sm:size-[4.5rem]" aria-hidden>
      <path d="M8 20 Q 7 8 20 8 L 60 9 Q 73 8 72 20 L 73 60 Q 73 72 60 72 L 20 71 Q 7 72 8 60 Z" {...line} style={{ ...ink, fill: "var(--sketch-paper)" }} />
      <path d="M8 22 L 72 22" {...line} style={ink} opacity={0.5} />
      <path d="M22 34 L 33 44 L 22 54 M40 56 L 58 56" {...line} style={ink} />
    </svg>
  );
}

/** Bouclier coché : l'évaluation validée. */
function ValidateIcon() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 sm:size-[4.5rem]" aria-hidden>
      <path d="M40 6 L 68 17 Q 68 52 40 74 Q 12 52 12 17 Z" {...line} style={{ ...brand, fill: "var(--brand-soft)" }} />
      <path d="M27 40 L 36 49 L 54 29" {...line} strokeWidth={3.2} style={brand} />
    </svg>
  );
}

/** Cadenas ouvert : le chapitre suivant est débloqué. */
function UnlockIcon() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 sm:size-[4.5rem]" aria-hidden>
      <path d="M26 34 L 26 22 Q 26 8 40 8 Q 54 8 54 20 L 54 24" {...line} style={ink} />
      <path d="M16 34 L 64 35 L 63 72 L 17 71 Z" {...line} style={{ ...ink, fill: "var(--sketch-tape)" }} />
      <circle cx="40" cy="50" r="5" {...line} style={ink} />
      <path d="M40 55 L 40 62" {...line} style={ink} />
    </svg>
  );
}

/** Flèche dessinée : vers la droite sur grand écran, vers le bas sur mobile. */
function Arrow() {
  return (
    <svg viewBox="0 0 48 24" className="my-4 h-6 w-12 shrink-0 rotate-90 md:my-0 md:mt-8 md:rotate-0" aria-hidden>
      <path d="M3 14 C 15 5, 29 5, 42 12" {...line} style={brand} />
      <path d="M34 6 L 43 12 L 34 17" {...line} style={brand} />
    </svg>
  );
}

function Step({ icon, label, note, accent }: { icon: ReactNode; label: string; note: string; accent?: boolean }) {
  return (
    <li className="flex w-40 flex-col items-center text-center">
      {icon}
      <span className={`sketch-font mt-1 text-[1.6rem] font-bold leading-none ${accent ? "text-brand" : "text-[color:var(--sketch-ink)]"}`}>{label}</span>
      <span className="sketch-font mt-1 text-lg leading-tight text-[color:var(--sketch-muted)]">{note}</span>
    </li>
  );
}

export function MethodSketchnote() {
  return (
    <figure className="relative mx-auto max-w-3xl">
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 h-6 w-28 -translate-x-1/2 -rotate-2 bg-[color:var(--sketch-tape)] opacity-90 shadow-sm"
      />
      <div className="sketchnote -rotate-[0.5deg] rounded-md border border-border px-5 pb-6 pt-7 sm:px-8">
        <figcaption className="text-center">
          <span className="sketch-font block text-[1.75rem] font-bold leading-tight sm:text-[2rem] text-[color:var(--sketch-ink)]">La méthode Cursus, en une page</span>
          <span className="sketch-font mt-0.5 block text-xl text-[color:var(--sketch-muted)]">un chapitre = une boucle à boucler</span>
        </figcaption>

        <ol className="mt-6 flex flex-col items-center gap-1 md:flex-row md:items-start md:justify-center md:gap-0">
          <Step icon={<ReadIcon />} label="Lire" note="le cours, pas à pas" />
          <Arrow />
          <Step icon={<PracticeIcon />} label="Pratiquer" note="exercices corrigés" />
          <Arrow />
          <Step icon={<ValidateIcon />} label="Valider" note={`≥ ${PASS_THRESHOLD} % ou on recommence`} accent />
          <Arrow />
          <Step icon={<UnlockIcon />} label="Débloquer" note="le chapitre suivant" />
        </ol>

        {/* Retour au début : la boucle se répète jusqu'à l'attestation */}
        <div className="mt-2 flex flex-col items-center">
          <svg viewBox="0 0 600 46" preserveAspectRatio="none" className="hidden h-11 w-full max-w-[620px] md:block" aria-hidden>
            <path d="M548 4 C 540 44, 70 46, 58 6" {...line} strokeDasharray="6 7" style={brand} opacity={0.75} />
            <path d="M50 14 L 58 5 L 66 15" {...line} style={brand} opacity={0.75} />
          </svg>
          <p className="sketch-font -mt-1 text-xl text-brand">↺ chapitre suivant… jusqu&apos;à l&apos;attestation</p>
        </div>

        <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
          <div className="rotate-[0.4deg] rounded-md bg-[color:var(--tone-rose-soft)] px-4 py-2.5">
            <p className="sketch-font text-xl font-bold text-[color:var(--tone-rose)]">⚠ Le piège</p>
            <p className="sketch-font text-lg leading-snug text-[color:var(--sketch-muted)]">
              Lire sans pratiquer : on croit savoir, l&apos;évaluation dit le contraire.
            </p>
          </div>
          <div className="-rotate-[0.4deg] rounded-md bg-[color:var(--accent-soft)] px-4 py-2.5">
            <p className="sketch-font text-xl font-bold text-accent">☆ À retenir</p>
            <p className="sketch-font text-lg leading-snug text-[color:var(--sketch-muted)]">Chaque chapitre ouvert est un chapitre maîtrisé.</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
