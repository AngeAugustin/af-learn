import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { blockingChapters, completionTimes, hardestQuestions } from "@/lib/admin/stats";
import { PASS_THRESHOLD } from "@/lib/quiz";
import { EmptyState, PageTitle, Panel, TableWrap, td, th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pédagogie" };
export const dynamic = "force-dynamic";

const days = (n: number | null) => (n === null ? "n/a" : `${n.toLocaleString("fr-FR")} j`);

export default async function PedagogyPage() {
  await requireAdmin("/admin/pedagogie");
  const [questions, chapters, times] = await Promise.all([hardestQuestions(), blockingChapters(), completionTimes()]);

  return (
    <>
      <PageTitle
        title="Pédagogie"
        description={`Où les apprenants butent : questions les plus ratées, chapitres difficiles à valider (seuil ${PASS_THRESHOLD} %), et durée pour finir un parcours.`}
      />

      <div className="space-y-6">
        <Panel title="Durée pour terminer un parcours" description="De la première section lue à l'attestation">
          <TableWrap>
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr>
                  <th className={th}>Parcours</th>
                  <th className={th}>Attestations</th>
                  <th className={th}>Durée médiane</th>
                  <th className={th}>Durée moyenne</th>
                </tr>
              </thead>
              <tbody>
                {times.map((t) => (
                  <tr key={t.title}>
                    <td className={`${td} text-fg`}>{t.title}</td>
                    <td className={`${td} font-mono tabular-nums`}>{t.certified}</td>
                    <td className={`${td} font-mono tabular-nums`}>{days(t.median_days)}</td>
                    <td className={`${td} font-mono tabular-nums`}>{days(t.avg_days)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Panel>

        <Panel
          title="Chapitres bloquants"
          description="Taux d'échec des tentatives, essais moyens avant réussite, et apprenants décrochés (chapitre commencé, non validé, aucune section lue depuis 14 jours)"
        >
          {chapters.length === 0 ? (
            <EmptyState>Aucune évaluation passée pour l&apos;instant.</EmptyState>
          ) : (
            <TableWrap>
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr>
                    <th className={th}>Chapitre</th>
                    <th className={th}>Échec</th>
                    <th className={th}>Tentatives</th>
                    <th className={th}>Validé par</th>
                    <th className={th}>Essais avant réussite</th>
                    <th className={th}>Décrochés</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((c) => (
                    <tr key={c.id}>
                      <td className={td}>
                        <span className="text-fg">{c.title}</span>
                        <span className="block text-xs text-fg-subtle">{c.parcours_title}</span>
                      </td>
                      <td className={`${td} min-w-32`}>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-bg-muted">
                            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${c.fail_rate}%` }} />
                          </div>
                          <span className="font-mono text-xs tabular-nums">{c.fail_rate} %</span>
                        </div>
                      </td>
                      <td className={`${td} font-mono tabular-nums`}>{c.attempts}</td>
                      <td className={`${td} font-mono tabular-nums`}>
                        {c.passed_learners}/{c.learners}
                      </td>
                      <td className={`${td} font-mono tabular-nums`}>{c.avg_attempts_to_pass?.toLocaleString("fr-FR") ?? "n/a"}</td>
                      <td className={`${td} font-mono tabular-nums`}>{c.stuck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Panel>

        <Panel title="Questions les plus ratées" description="Évaluations de chapitre, questions ayant reçu au moins 3 réponses">
          {questions.length === 0 ? (
            <EmptyState>Pas encore assez de réponses pour classer les questions.</EmptyState>
          ) : (
            <ol className="divide-y divide-border/60">
              {questions.map((q) => (
                <li key={q.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_9rem] sm:items-center">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-fg">{q.prompt}</p>
                    <p className="mt-0.5 text-xs text-fg-subtle">
                      {q.chapter_title} · {q.parcours_title} ·{" "}
                      <Link href={`/admin/catalogue/${q.parcours_slug}/chapitres/${q.chapter_id}/questions#question-${q.id}`} className="font-semibold text-brand hover:underline">
                        Modifier la question
                      </Link>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-sm font-semibold tabular-nums text-fg">{q.fail_rate} % d&apos;erreurs</span>
                    <span className="block font-mono text-xs tabular-nums text-fg-subtle">
                      {q.wrong}/{q.answers} réponses
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
