import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen, Brain, ChartLine, Check, CircleDollarSign, Clock, Cloud, Code2, Compass, Cpu, Database, Eye,
  FileText, Filter, FlaskConical, Gauge, GitBranch, KeyRound, Layers, Lightbulb, Link2, List, Lock,
  MessageSquare, Network, PenLine, Puzzle, RefreshCw, Rocket, Ruler, Scale, Search, Server, Shield,
  Sparkles, Star, Target, Terminal, TriangleAlert, Users, Wrench, Zap,
} from "lucide-react";
import { parseSketchnote, type SketchnoteSpec } from "@/lib/sketchnote";
import { slugify } from "@/lib/content/parse";
import { SketchnoteDownload } from "./sketchnote-download";

const ICONS: Record<SketchnoteSpec["points"][number]["icon"], typeof Brain> = {
  brain: Brain, code: Code2, database: Database, search: Search, layers: Layers, shield: Shield, gauge: Gauge,
  money: CircleDollarSign, clock: Clock, target: Target, check: Check, alert: TriangleAlert, idea: Lightbulb,
  tool: Wrench, rocket: Rocket, users: Users, chat: MessageSquare, file: FileText, git: GitBranch, test: FlaskConical,
  chart: ChartLine, cpu: Cpu, cloud: Cloud, lock: Lock, key: KeyRound, link: Link2, puzzle: Puzzle, loop: RefreshCw,
  filter: Filter, scale: Scale, eye: Eye, book: BookOpen, sparkles: Sparkles, network: Network, server: Server,
  terminal: Terminal, ruler: Ruler, zap: Zap, compass: Compass, list: List,
};

const TONES = ["violet", "blue", "amber", "teal", "violet", "blue"] as const;
const TILTS = [-1.2, 0.9, -0.6, 1.1, -0.9, 0.7];

/** Contour irrégulier « dessiné à la main » (le texte, lui, reste net). */
function SketchBorder({
  color = "var(--sketch-ink)",
  radius = "1.1rem",
  dashed = false,
  width = 2,
  filterId = "sketch-wobble",
}: {
  color?: string;
  radius?: string;
  dashed?: boolean;
  width?: number;
  filterId?: string;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ border: `${width}px ${dashed ? "dashed" : "solid"} ${color}`, borderRadius: radius, filter: `url(#${filterId})` }}
    />
  );
}

function Highlight({ children, color = "var(--sketch-highlight)" }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="relative inline whitespace-normal px-1"
      style={{
        backgroundImage: `linear-gradient(104deg, transparent 0.6%, ${color} 2.4%, ${color} 96%, transparent 99%)`,
        backgroundSize: "100% 42%",
        backgroundPosition: "0 88%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </span>
  );
}

function Squiggle() {
  return (
    <svg viewBox="0 0 160 24" className="mx-auto h-5 w-32 text-[var(--sketch-ink)] opacity-60" aria-hidden>
      <path
        d="M4 14c10-10 18 8 28 0s18-8 28 0 18 8 28 0 18-8 28 0 18 6 26-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M140 6l8 6-9 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sketchnote de fin de chapitre : synthèse visuelle dessinée de l'essentiel à retenir. */
export function Sketchnote({
  source,
  showDownload = true,
  filterId,
  badge,
}: {
  source: string;
  showDownload?: boolean;
  /** Identifiant unique du filtre SVG (obligatoire si plusieurs sketchnotes sur la même page). */
  filterId?: string;
  /** Remplace le badge « à revoir avant l'évaluation ». */
  badge?: string;
}) {
  let spec: SketchnoteSpec;
  try {
    spec = parseSketchnote(source);
  } catch (error) {
    return (
      <div className="not-prose my-6 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm text-danger">
        Sketchnote invalide : {(error as Error).message}
      </div>
    );
  }
  const wobbleId = filterId ?? `sketch-wobble-${slugify(spec.title)}`;
  const columns = spec.points.length === 4 ? "@2xl:grid-cols-2" : "@2xl:grid-cols-2 @4xl:grid-cols-3";
  // Nombre impair de bulles sur 2 colonnes : la dernière occupe toute la largeur
  const spanLast = spec.points.length % 2 === 1;

  return (
    <div data-sketchnote-root className="not-prose my-8">
      {showDownload && (
        <div className="no-print mb-3 flex justify-end">
          <SketchnoteDownload title={spec.title} fileName={`sketchnote-${slugify(spec.title)}.pdf`} />
        </div>
      )}
      <figure
        className="sketchnote not-prose @container relative overflow-hidden rounded-[1.4rem] px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7"
        aria-label={`Sketchnote : ${spec.title}`}
      >
        {/* Filtre SVG pour l'effet « trait à main levée » (id unique par instance) */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id={wobbleId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <SketchBorder filterId={wobbleId} width={2.5} radius="1.4rem" />

        {/* En-tête */}
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <span className="sketch-font inline-flex items-center gap-2 text-xl text-[var(--sketch-muted)]">
            <PenLine className="size-5" aria-hidden /> Sketchnote
          </span>
          <span className="sketch-font -rotate-2 rounded-md bg-[var(--sketch-tape)] px-3 py-0.5 text-lg text-[var(--sketch-ink)] shadow-sm">
            {badge ?? "à revoir avant l'évaluation"}
          </span>
        </div>
        <h3 className="sketch-font relative mt-3 text-center text-[2.1rem] font-bold leading-tight text-[var(--sketch-ink)] sm:text-[2.6rem]">
          <Highlight>{spec.title}</Highlight>
        </h3>

        {/* Idée centrale */}
        <div className="relative mx-auto mt-6 max-w-2xl rotate-[-0.6deg] px-9 py-6 text-center sm:px-14 sm:py-7">
          <SketchBorder filterId={wobbleId} color="var(--brand)" radius="48% 52% 46% 54% / 60% 48% 52% 40%" width={3} />
          <p className="sketch-font text-lg uppercase tracking-wide text-brand">L&apos;idée centrale</p>
          <p className="sketch-font mt-1 text-[1.6rem] leading-snug text-[var(--sketch-ink)]">{spec.center}</p>
        </div>
        <Squiggle />

        {/* Bulles */}
        <ol className={`relative mt-4 grid grid-cols-1 gap-5 ${columns}`}>
          {spec.points.map((p, i) => {
            const Icon = ICONS[p.icon];
            const tone = TONES[i % TONES.length];
            const style = { "--tone": `var(--tone-${tone})`, "--tone-soft": `var(--tone-${tone}-soft)`, rotate: `${TILTS[i % TILTS.length]}deg` } as CSSProperties;
            return (
              <li
                key={i}
                className={`relative px-4 pb-4 pt-3.5 ${spanLast && i === spec.points.length - 1 ? "@2xl:col-span-2 @4xl:col-span-1" : ""}`}
                style={style}
              >
                <span aria-hidden className="absolute inset-0 rounded-[1.1rem] bg-[var(--tone-soft)] opacity-80" />
                <SketchBorder filterId={wobbleId} color="var(--tone)" />
                <div className="relative flex items-start gap-3">
                  <span className="relative flex size-11 shrink-0 items-center justify-center text-[var(--tone)]">
                    <SketchBorder filterId={wobbleId} color="var(--tone)" radius="50%" />
                    <Icon className="size-5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="sketch-font text-[1.45rem] font-bold leading-tight text-[var(--sketch-ink)]">
                      <span className="mr-1.5 text-[var(--tone)]">{i + 1}.</span>
                      {p.title}
                    </p>
                    <p className="sketch-font mt-1 text-[1.2rem] leading-snug text-[var(--sketch-ink)] opacity-85">{p.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Piège et phrase à retenir */}
        <div className="relative mt-7 grid grid-cols-1 gap-5 @2xl:grid-cols-2">
          <div className="relative rotate-[0.6deg] px-4 py-3.5">
            <span aria-hidden className="absolute inset-0 rounded-[1.1rem] bg-[var(--tone-rose-soft)] opacity-80" />
            <SketchBorder filterId={wobbleId} color="var(--tone-rose)" dashed />
            <p className="sketch-font relative flex items-center gap-2 text-[1.35rem] font-bold text-[var(--tone-rose)]">
              <TriangleAlert className="size-5" aria-hidden /> Piège à éviter
            </p>
            <p className="sketch-font relative mt-1 text-[1.2rem] leading-snug text-[var(--sketch-ink)]">{spec.pitfall}</p>
          </div>
          <div className="relative -rotate-[0.6deg] px-4 py-3.5">
            <span aria-hidden className="absolute inset-0 rounded-[1.1rem] bg-[var(--sketch-tape)] opacity-70" />
            <SketchBorder filterId={wobbleId} color="var(--tone-amber)" />
            <p className="sketch-font relative flex items-center gap-2 text-[1.35rem] font-bold text-[var(--tone-amber)]">
              <Star className="size-5" aria-hidden /> À retenir en une phrase
            </p>
            <p className="sketch-font relative mt-1 text-[1.25rem] leading-snug text-[var(--sketch-ink)]">{spec.remember}</p>
          </div>
        </div>
      </figure>
    </div>
  );
}
