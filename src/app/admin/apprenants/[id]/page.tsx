import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getCourse } from "@/lib/queries";
import {
  getLearner,
  learnerCertificates,
  learnerExamHistory,
  learnerQuizHistory,
  learnerReviews,
  learnerSessions,
  startedCourseSlugs,
} from "@/lib/admin/learners";
import { AUDIT_LABELS, listAudit } from "@/lib/admin/audit";
import { fmtDate, fmtDateTime, fmtPct, fmtRelative } from "@/lib/admin/format";
import { Badge, EmptyState, Kpi, Notice, PageTitle, Panel, TableWrap, td, th } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import {
  deleteUserAction,
  logoutAllAction,
  resetProgressAction,
  sendResetLinkAction,
  setCertificateRevokedAction,
  setSuspendedAction,
  updateProfileAction,
} from "../../actions";

export const metadata: Metadata = { title: "Fiche apprenant" };
export const dynamic = "force-dynamic";

const NOTICES: Record<string, [boolean, string]> = {
  "profil-ok": [true, "Profil mis à jour."],
  "profil-invalide": [false, "Nom (2 caractères minimum) ou adresse invalide."],
  "email-pris": [false, "Cette adresse est déjà utilisée par un autre compte."],
  "lien-envoye": [true, "Un lien de réinitialisation (valable une heure) a été envoyé à l'apprenant."],
  "lien-echec": [false, "L'email n'a pas pu être envoyé. Vérifiez la configuration de l'envoi d'emails."],
  suspendu: [true, "Compte suspendu : la personne est déconnectée et ne peut plus se connecter."],
  reactive: [true, "Compte réactivé."],
  "sessions-fermees": [true, "Toutes les sessions ont été fermées."],
  "progression-effacee": [true, "Progression effacée."],
  "portee-invalide": [false, "Choisissez un chapitre ou un parcours à réinitialiser."],
  "attestation-revoquee": [true, "Attestation révoquée : la page de vérification l'indique désormais."],
  "attestation-retablie": [true, "Attestation rétablie."],
  "attestation-introuvable": [false, "Attestation introuvable."],
  "motif-requis": [false, "Indiquez le motif de la révocation."],
  "confirmation-incorrecte": [false, "L'adresse saisie ne correspond pas : le compte n'a pas été supprimé."],
  "pas-soi-meme": [false, "Cette action n'est pas possible sur votre propre compte."],
  "admin-protege": [false, "Action impossible sur un autre administrateur : retirez d'abord ses droits d'administration."],
};

const input = "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-brand";

export default async function LearnerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin(`/admin/apprenants/${id}`);
  const [user, { notice }] = await Promise.all([getLearner(id), searchParams]);
  if (!user) notFound();

  const [slugs, sessions, quizzes, exams, reviews, certificates, history] = await Promise.all([
    startedCourseSlugs(user.id),
    learnerSessions(user.id),
    learnerQuizHistory(user.id),
    learnerExamHistory(user.id),
    learnerReviews(user.id),
    learnerCertificates(user.id),
    listAudit({ userId: user.id, limit: 20 }),
  ]);
  const courses = (await Promise.all(slugs.map((s) => getCourse(s.slug, user.id)))).filter((c) => c !== null);
  const self = user.id === admin.id;
  const hidden = <input type="hidden" name="userId" value={user.id} />;

  return (
    <>
      <Link href="/admin/apprenants" className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden /> Tous les apprenants
      </Link>
      <PageTitle
        title={user.name}
        description={user.email}
        actions={
          <a
            href={`/admin/apprenants/${user.id}/export`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
          >
            <Download className="size-4" aria-hidden /> Exporter ses données
          </a>
        }
      />
      <div className="-mt-3 mb-5 flex flex-wrap gap-1.5">
        {user.role === "admin" && <Badge tone="brand">administrateur</Badge>}
        {user.suspended_at ? <Badge tone="danger">suspendu le {fmtDate(user.suspended_at)}</Badge> : <Badge tone="success">compte actif</Badge>}
      </div>
      <Notice code={notice} messages={NOTICES} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Inscription" value={<span className="text-lg">{fmtDate(user.created_at)}</span>} />
        <Kpi label="Dernière activité" value={<span className="text-lg">{fmtRelative(user.last_active)}</span>} hint={user.last_seen_at ? `Dernière visite connectée : ${fmtDateTime(user.last_seen_at)}` : undefined} />
        <Kpi label="Sessions ouvertes" value={sessions.length} hint={sessions[0] ? `La plus récente : ${fmtDateTime(sessions[0].created_at)}` : "Aucune"} />
        <Kpi label="Évaluations" value={quizzes.length} hint={`${quizzes.filter((q) => q.passed).length} réussie(s) sur les dernières`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Progression" description="Chapitres validés par module, et chapitre en cours">
            {courses.length === 0 ? (
              <EmptyState>Aucun parcours commencé.</EmptyState>
            ) : (
              <div className="space-y-6">
                {courses.map((c) => {
                  const current = c.chapters.find((ch) => ch.state === "in_progress" || ch.state === "available");
                  return (
                    <div key={c.parcours.slug}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-fg">{c.parcours.title}</h3>
                        <span className="font-mono text-xs tabular-nums text-fg-muted">
                          {c.totals.passed}/{c.totals.chapters} chapitres · {fmtPct(c.totals.passed, c.totals.chapters)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-fg-muted">
                        {current ? (
                          <>
                            En cours : <span className="text-fg">{current.title}</span> ({current.completedSectionIds.size}/{current.sections.length} sections
                            {current.attempts ? `, ${current.attempts} tentative(s), meilleur score ${current.bestScore} %` : ""})
                          </>
                        ) : (
                          "Tous les chapitres sont validés."
                        )}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {c.modules.map((m) => {
                          const passed = m.chapters.filter((ch) => ch.passed).length;
                          return (
                            <li key={m.id} className="grid grid-cols-[1fr_7rem_3.5rem] items-center gap-3 text-xs">
                              <span className="truncate text-fg-muted" title={m.title}>{m.title}</span>
                              <div className="h-1.5 rounded-full bg-bg-muted">
                                <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(100 * passed) / Math.max(1, m.chapters.length)}%` }} />
                              </div>
                              <span className="text-right font-mono tabular-nums text-fg-muted">{passed}/{m.chapters.length}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Évaluations de chapitre" description="40 dernières tentatives">
            {quizzes.length === 0 ? (
              <EmptyState>Aucune évaluation passée.</EmptyState>
            ) : (
              <TableWrap>
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr>
                      <th className={th}>Date</th>
                      <th className={th}>Chapitre</th>
                      <th className={th}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((q) => (
                      <tr key={q.id}>
                        <td className={`${td} whitespace-nowrap text-fg-muted`}>{fmtDateTime(q.created_at)}</td>
                        <td className={td}>
                          <span className="text-fg">{q.chapter_title}</span>
                          <span className="block text-xs text-fg-subtle">{q.parcours_title}</span>
                        </td>
                        <td className={`${td} whitespace-nowrap`}>
                          <span className="font-mono tabular-nums text-fg">{q.score} %</span>{" "}
                          <Badge tone={q.passed ? "success" : "danger"}>{q.passed ? "validé" : "échec"}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Panel>

          <Panel title="Examens">
            {exams.length === 0 ? (
              <EmptyState>Aucun examen passé.</EmptyState>
            ) : (
              <ul className="divide-y divide-border/60 text-sm">
                {exams.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      <span className="text-fg">{e.module_title ? `Examen de module : ${e.module_title}` : "Examen final"}</span>
                      <span className="block text-xs text-fg-subtle">
                        {e.parcours_title} · {fmtDateTime(e.created_at)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="font-mono tabular-nums">{e.score} %</span>{" "}
                      <Badge tone={e.passed ? "success" : "danger"}>{e.passed ? "réussi" : "échec"}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Révisions espacées">
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="label-mono text-fg-subtle">Cartes</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums text-fg">{reviews.total}</dd>
              </div>
              <div>
                <dt className="label-mono text-fg-subtle">À réviser</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums text-fg">{reviews.due}</dd>
              </div>
              <div>
                <dt className="label-mono text-fg-subtle">Maîtrisées</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums text-fg">{reviews.mastered}</dd>
              </div>
              <div>
                <dt className="label-mono text-fg-subtle">Réussite</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums text-fg">{reviews.answers ? fmtPct(reviews.correct, reviews.answers) : "n/a"}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-fg-muted">
              {reviews.sessions} séance(s) de révision, dernière : {fmtDateTime(reviews.last)}. {reviews.lapses} oubli(s) au total.
            </p>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Attestations">
            {certificates.length === 0 ? (
              <EmptyState>Aucune attestation délivrée.</EmptyState>
            ) : (
              <ul className="space-y-4">
                {certificates.map((c) => (
                  <li key={c.code} className="rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-fg">{c.parcours_title}</span>
                      {c.revoked_at ? <Badge tone="danger">révoquée</Badge> : <Badge tone="success">valide</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-fg-muted">
                      <Link href={`/verifier/${c.code}`} className="inline-flex items-center gap-1 font-mono text-fg hover:text-brand" target="_blank">
                        {c.code} <ExternalLink className="size-3" aria-hidden />
                      </Link>{" "}
                      · délivrée le {fmtDate(c.issued_at)} · examen final {c.final_score} %
                    </p>
                    {c.revoked_at && (
                      <p className="mt-1 text-xs text-danger">
                        Révoquée le {fmtDate(c.revoked_at)} : {c.revoked_reason}
                      </p>
                    )}
                    <form action={setCertificateRevokedAction} className="mt-3 flex flex-wrap gap-2">
                      {hidden}
                      <input type="hidden" name="code" value={c.code} />
                      {c.revoked_at ? (
                        <ConfirmButton message="Rétablir cette attestation ?">Rétablir</ConfirmButton>
                      ) : (
                        <>
                          <input type="hidden" name="revoke" value="1" />
                          <input name="reason" required placeholder="Motif de la révocation" className={`${input} flex-1`} />
                          <ConfirmButton tone="danger" message="Révoquer cette attestation ? La page de vérification l'indiquera publiquement.">
                            Révoquer
                          </ConfirmButton>
                        </>
                      )}
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Profil">
            <form action={updateProfileAction} className="space-y-3">
              {hidden}
              <label className="block text-sm">
                <span className="label-mono text-fg-subtle">Nom</span>
                <input name="name" defaultValue={user.name} required minLength={2} maxLength={80} className={`${input} mt-1.5`} />
              </label>
              <label className="block text-sm">
                <span className="label-mono text-fg-subtle">Adresse électronique</span>
                <input name="email" type="email" defaultValue={user.email} required className={`${input} mt-1.5`} />
              </label>
              <ConfirmButton tone="brand">Enregistrer</ConfirmButton>
            </form>
          </Panel>

          <Panel title="Accès au compte" description="L'administrateur ne voit ni ne choisit jamais le mot de passe.">
            <div className="space-y-4">
              <form action={sendResetLinkAction} className="flex flex-wrap items-center justify-between gap-3">
                {hidden}
                <p className="text-sm text-fg-muted">Envoyer un lien pour choisir un nouveau mot de passe.</p>
                <ConfirmButton message={`Envoyer un lien de réinitialisation à ${user.email} ?`}>Envoyer le lien</ConfirmButton>
              </form>
              {!self && (
                <form action={logoutAllAction} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  {hidden}
                  <p className="text-sm text-fg-muted">Fermer les {sessions.length} session(s) ouverte(s).</p>
                  <ConfirmButton message="Déconnecter cette personne de tous ses appareils ?">Déconnecter partout</ConfirmButton>
                </form>
              )}
              {!self && user.role !== "admin" && (
                <form action={setSuspendedAction} className="space-y-2 border-t border-border pt-4">
                  {hidden}
                  {user.suspended_at ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-fg-muted">Le compte est suspendu depuis le {fmtDate(user.suspended_at)}.</p>
                      <ConfirmButton tone="brand">Réactiver</ConfirmButton>
                    </div>
                  ) : (
                    <>
                      <input type="hidden" name="suspend" value="1" />
                      <input name="reason" placeholder="Motif (facultatif, visible dans le journal)" className={input} />
                      <ConfirmButton tone="danger" message="Suspendre ce compte ? La personne sera déconnectée immédiatement.">
                        Suspendre le compte
                      </ConfirmButton>
                    </>
                  )}
                </form>
              )}
            </div>
          </Panel>

          {courses.length > 0 && (
            <Panel title="Réinitialiser la progression" description="Efface les sections lues, les évaluations et les cartes de révision correspondantes. Les attestations ne sont pas touchées.">
              <form action={resetProgressAction} className="space-y-2">
                {hidden}
                <select name="scope" required defaultValue="" className={input}>
                  <option value="" disabled>
                    Choisir un chapitre ou un parcours
                  </option>
                  {courses.map((c) => (
                    <optgroup key={c.parcours.slug} label={c.parcours.title}>
                      <option value={`course:${c.parcours.id}`}>Tout le parcours {c.parcours.title} (examens compris)</option>
                      {c.chapters
                        .filter((ch) => ch.completedSectionIds.size > 0 || ch.attempts > 0)
                        .map((ch) => (
                          <option key={ch.id} value={`chapter:${ch.id}`}>
                            {ch.title}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <ConfirmButton tone="danger" message="Effacer définitivement cette progression ?">
                  Réinitialiser
                </ConfirmButton>
              </form>
            </Panel>
          )}

          {!self && user.role !== "admin" && (
            <Panel title="Supprimer le compte" description="Effacement définitif du compte et de toutes ses données (droit à l'effacement). Irréversible.">
              <form action={deleteUserAction} className="space-y-2">
                {hidden}
                <label className="block text-sm text-fg-muted">
                  Pour confirmer, saisissez <span className="font-mono text-fg">{user.email}</span>
                  <input name="confirm" required autoComplete="off" className={`${input} mt-1.5`} />
                </label>
                <ConfirmButton tone="danger" message="Supprimer définitivement ce compte et toutes ses données ?">
                  Supprimer définitivement
                </ConfirmButton>
              </form>
            </Panel>
          )}

          <Panel title="Historique d'administration">
            {history.length === 0 ? (
              <EmptyState>Aucune action d&apos;administration sur ce compte.</EmptyState>
            ) : (
              <ul className="space-y-2 text-sm">
                {history.map((h) => (
                  <li key={h.id}>
                    <span className="text-fg">{AUDIT_LABELS[h.action] ?? h.action}</span>
                    <span className="block text-xs text-fg-subtle">
                      {fmtDateTime(h.created_at)} · {h.actor_email}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
