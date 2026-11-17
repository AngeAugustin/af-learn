import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Hourglass } from "lucide-react";
import type { ParcoursRow } from "@/lib/queries";
import { ParcoursIcon, parcoursTone } from "@/components/ui/parcours-icon";

type Course = ParcoursRow & { module_count: number; chapter_count: number; minutes: number };

/**
 * Carte du catalogue, inspirée des grandes plateformes de formation : couverture dans la couleur du parcours,
 * éditeur, titre, compétences, badge d'attestation (ou progression) et ligne de détails.
 */
export function CourseCard({ course: p, badge, passed }: { course: Course; badge?: string; passed?: number }) {
  const tone = parcoursTone(p.color);
  const published = p.status === "published";
  const hours = Math.max(1, Math.round(p.minutes / 60));
  const progress = published && passed && p.chapter_count ? Math.min(100, Math.round((100 * passed) / p.chapter_count)) : null;
  const done = progress === 100;

  const photo = published ? p.cover : null;

  const body = (
    <>
      <div
        className={`relative h-36 overflow-hidden ${published ? "catalog-cover" : "bg-bg-muted"}`}
        style={published ? ({ "--cover": tone.color } as React.CSSProperties) : undefined}
        title={photo ? `Photo : ${photo.author} (Unsplash)` : undefined}
      >
        {photo ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Le bas de la photo prend la couleur du parcours : la ligne « DOMAINE · N MODULES » reste lisible. */}
            <div aria-hidden className="catalog-cover-shade absolute inset-0" />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1.2px,transparent_1.4px)] bg-[size:16px_16px] transition-transform duration-500 group-hover:scale-110"
            />
            <ParcoursIcon
              icon={p.icon}
              className={`absolute -bottom-5 -right-3 size-32 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105 ${
                published ? "text-white/25" : "text-fg-subtle/30"
              }`}
            />
          </>
        )}
        {badge && published && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-[#172815] shadow-sm">{badge}</span>
        )}
        {!published && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-bg-elevated px-2 py-0.5 text-[11px] font-bold text-fg-muted">
            <Hourglass className="size-3" aria-hidden /> Bientôt disponible
          </span>
        )}
        <span
          className={`absolute bottom-3 left-4 font-mono text-xs tracking-[0.08em] ${published ? "text-white/90" : "text-fg-subtle"} ${
            photo ? "[text-shadow:0_1px_2px_rgba(0,0,0,0.4)]" : ""
          }`}
        >
          {(p.domain || "Parcours").toUpperCase()}
          {published && ` · ${p.module_count} MODULES`}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-xs text-fg-muted">
          <span className="flex size-[18px] items-center justify-center rounded bg-brand text-[10px] font-bold text-brand-fg">C</span>
          Cursus
        </p>
        <h2 className="mt-2 text-[17px] font-bold leading-snug tracking-[-0.015em] text-fg transition-colors group-hover:text-brand">{p.title}</h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-fg-muted">
          {p.skills.length > 0 ? (
            <>
              <span className="font-semibold text-fg">Compétences :</span> {p.skills.join(", ")}
            </>
          ) : (
            p.tagline
          )}
        </p>

        <div className="mt-auto pt-4">
          {progress !== null ? (
            <div className="mb-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-muted">
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: tone.color }} />
              </div>
              <p className="mt-1.5 text-xs font-semibold" style={{ color: tone.color }}>
                {done ? "Parcours terminé" : `${progress} % terminé · Reprendre`}
              </p>
            </div>
          ) : (
            published && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success">
                <Award className="size-3.5" aria-hidden /> Attestation
              </span>
            )
          )}
          <p className="flex items-center justify-between gap-2 text-xs text-fg-subtle">
            <span>{published ? `${p.level} · Parcours · ~${hours} h` : "En préparation"}</span>
            {published && <ArrowRight className="size-4 shrink-0 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />}
          </p>
        </div>
      </div>
    </>
  );

  const className = "card group flex h-full flex-col overflow-hidden rounded-xl transition duration-200";
  return published ? (
    <Link href={`/parcours/${p.slug}`} className={`${className} hover:-translate-y-1 hover:shadow-hover focus-visible:ring-2 focus-visible:ring-[var(--ring)]`}>
      {body}
    </Link>
  ) : (
    <div className={`${className} opacity-80`} aria-disabled="true">
      {body}
    </div>
  );
}
