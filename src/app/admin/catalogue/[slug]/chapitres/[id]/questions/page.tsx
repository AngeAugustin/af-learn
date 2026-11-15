import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCatalogChapter, getChapterQuestions, MAX_OPTIONS } from "@/lib/admin/catalog";
import { fmtPct } from "@/lib/admin/format";
import { Badge, EmptyState, Notice, PageTitle } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { updateQuestionAction } from "../../../../actions";
import { CATALOG_NOTICES, input, keyOf, label, RevertButton } from "../../../../shared";

export const metadata: Metadata = { title: "Questions d'un chapitre" };
export const dynamic = "force-dynamic";

const LETTERS = "ABCDEFGH";

export default async function CatalogQuestionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { slug, id } = await params;
  await requireAdmin(`/admin/catalogue/${slug}/chapitres/${id}/questions`);
  const chapterId = Number(id);
  const valid = Number.isInteger(chapterId) && chapterId > 0;
  const [data, questions, { notice }] = await Promise.all([
    valid ? getCatalogChapter(chapterId) : null,
    valid ? getChapterQuestions(chapterId) : [],
    searchParams,
  ]);
  if (!data || data.chapter.parcours_slug !== slug) notFound();
  const { chapter } = data;

  return (
    <>
      <Link href={`/admin/catalogue/${slug}#chapitre-${chapter.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden /> {chapter.parcours_title}
      </Link>
      <PageTitle
        title={`Questions · ${chapter.title}`}
        description={`${chapter.module_title} · ${questions.length} questions dans la banque du chapitre. Chaque évaluation en tire une partie.`}
        actions={
          <Link
            href={`/admin/catalogue/${slug}/chapitres/${chapter.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
          >
            Contenu des sections
          </Link>
        }
      />
      <Notice code={notice} messages={CATALOG_NOTICES} />

      <p className="mb-5 rounded-lg border border-border bg-bg-muted px-4 py-3 text-xs leading-relaxed text-fg-muted">
        Une modification s&apos;applique aux prochaines évaluations, révisions et examens. Les tentatives passées gardent leur
        score. Pour ne pas fausser l&apos;affichage de leurs corrections, préférez reformuler une réponse plutôt que changer
        l&apos;ordre ou le nombre des réponses. Les lignes de réponse laissées vides sont ignorées.
      </p>

      {questions.length === 0 ? (
        <EmptyState>Ce chapitre n&apos;a pas de questions.</EmptyState>
      ) : (
        <ol className="space-y-3">
          {questions.map((q, i) => {
            const edited = Object.keys(q.overrides).length > 0;
            const rows = Array.from({ length: Math.min(MAX_OPTIONS, Math.max(q.options.length + 2, 4)) }, (_, k) => k);
            const failRate = q.answers ? Math.round((100 * q.wrong) / q.answers) : null;
            return (
              <li key={q.id} id={`question-${q.id}`} className="card scroll-mt-24">
                <details className="group">
                  <summary className="flex cursor-pointer list-none flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3">
                    <span className="mt-0.5 font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-[12rem] flex-1 text-sm text-fg">{q.prompt}</span>
                    <span className="flex flex-wrap items-center gap-2">
                      {q.multiple && <Badge>Plusieurs réponses</Badge>}
                      {edited && <Badge tone="brand">Modifiée</Badge>}
                      {failRate !== null ? (
                        <span
                          className="font-mono text-[11px] tabular-nums text-fg-subtle"
                          title={`${q.wrong} erreur(s) sur ${q.answers} réponse(s) en évaluation`}
                        >
                          {fmtPct(q.wrong, q.answers)} d&apos;erreurs · {q.answers} rép.
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-fg-subtle">pas encore posée</span>
                      )}
                      <span className="text-xs font-semibold text-brand group-open:hidden">Modifier</span>
                    </span>
                  </summary>
                  <div className="border-t border-border px-4 py-4">
                    <form key={keyOf([q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation])} action={updateQuestionAction} className="grid gap-4">
                      <input type="hidden" name="id" value={q.id} />
                      <div>
                        <label className={label} htmlFor={`q-prompt-${q.id}`}>Énoncé</label>
                        <textarea id={`q-prompt-${q.id}`} name="prompt" defaultValue={q.prompt} required rows={3} maxLength={2000} className={input} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`q-code-${q.id}`}>Extrait de code (facultatif)</label>
                        <textarea
                          id={`q-code-${q.id}`}
                          name="code"
                          defaultValue={q.code ?? ""}
                          rows={q.code ? Math.min(14, q.code.split("\n").length + 1) : 2}
                          maxLength={5000}
                          spellCheck={false}
                          className={`${input} font-mono text-[13px]`}
                        />
                      </div>
                      <fieldset>
                        <legend className={label}>Réponses (cochez la ou les bonnes)</legend>
                        <div className="grid gap-2">
                          {rows.map((k) => (
                            <div key={k} className="flex items-center gap-2">
                              <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-semibold text-fg-muted">
                                <input
                                  type="checkbox"
                                  name="correct"
                                  value={k}
                                  defaultChecked={q.correct.includes(k)}
                                  className="size-4 accent-[var(--success)]"
                                  aria-label={`Réponse ${LETTERS[k]} correcte`}
                                />
                                <span className="w-4 font-mono">{LETTERS[k]}</span>
                              </label>
                              <input
                                name={`option_${k}`}
                                defaultValue={q.options[k] ?? ""}
                                maxLength={500}
                                placeholder={k < q.options.length ? "" : "Réponse supplémentaire (facultatif)"}
                                aria-label={`Réponse ${LETTERS[k]}`}
                                className={input}
                              />
                            </div>
                          ))}
                        </div>
                        <label className="mt-3 flex items-center gap-2 text-sm text-fg">
                          <input type="checkbox" name="multiple" defaultChecked={q.multiple} className="size-4 accent-[var(--brand)]" />
                          Plusieurs réponses possibles (la question l&apos;indique à l&apos;apprenant)
                        </label>
                      </fieldset>
                      <div>
                        <label className={label} htmlFor={`q-expl-${q.id}`}>Explication affichée après la correction</label>
                        <textarea id={`q-expl-${q.id}`} name="explanation" defaultValue={q.explanation} required rows={3} maxLength={3000} className={input} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <ConfirmButton tone="brand">Enregistrer la question</ConfirmButton>
                        <span className="inline-flex items-center gap-1 text-xs text-fg-subtle">
                          <Check className="size-3.5 text-success" aria-hidden />
                          Bonne(s) réponse(s) actuelle(s) : {q.correct.map((c) => LETTERS[c]).join(", ")}
                        </span>
                      </div>
                    </form>
                    {edited && (
                      <div className="mt-3">
                        <RevertButton kind="questions" id={q.id} what="cette question" />
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
