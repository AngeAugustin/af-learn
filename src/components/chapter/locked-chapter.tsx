import Link from "next/link";
import { Lock } from "lucide-react";
import type { ChapterContext } from "@/lib/chapter-context";
import { PASS_THRESHOLD } from "@/lib/quiz";

export function LockedChapter({ ctx }: { ctx: ChapterContext }) {
  const { previous, course } = ctx;
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-bg-muted text-fg-subtle">
        <Lock className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-fg">Ce chapitre est verrouillé</h1>
      <p className="mt-3 leading-relaxed text-fg-muted">
        Pour y accéder, validez d&apos;abord l&apos;évaluation du chapitre précédent avec au moins {PASS_THRESHOLD} %
        {previous ? <> : <strong className="text-fg">{previous.title}</strong>.</> : "."}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {previous && (
          <Link
            href={`/parcours/${course.parcours.slug}/${previous.moduleSlug}/${previous.slug}`}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
          >
            Aller au chapitre précédent
          </Link>
        )}
        <Link href={`/parcours/${course.parcours.slug}`} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg hover:bg-bg-muted">
          Voir le programme
        </Link>
      </div>
    </div>
  );
}
