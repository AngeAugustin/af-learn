import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, PenLine } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getCourse } from "@/lib/queries";
import { getExamSummaries } from "@/lib/memorisation-queries";
import { certificateReady } from "@/lib/exams";
import { resendVerificationAction } from "@/app/actions/email";
import { issueCertificate, linkedinAddUrl, qrSvg, siteOrigin } from "@/lib/certificates";
import { PrintButton } from "@/components/ui/print-button";
import { CertificateSheet } from "@/components/certificate/certificate-sheet";
import { CopyLinkButton } from "@/components/certificate/copy-link-button";

export const metadata: Metadata = { title: "Attestation de fin de parcours" };

function LinkedinMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v5.3h-4v-4.7c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5v4.8h-4z" />
    </svg>
  );
}

export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ parcours: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { parcours: slug } = await params;
  const { email: emailNotice } = await searchParams;
  const user = await requireUser(`/certificat/${slug}`);
  const course = await getCourse(slug, user.id);
  if (!course || course.parcours.status !== "published") notFound();
  const { totals, parcours } = course;
  const finalExam = (await getExamSummaries(user.id, parcours.id)).find((s) => s.module_id === null) ?? null;
  const chaptersDone = totals.chapters > 0 && totals.passed === totals.chapters;
  const complete = certificateReady(course, finalExam?.passed ?? false);

  if (!complete) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <Award className="mx-auto size-12 text-fg-subtle" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-fg">Attestation non disponible</h1>
        <p className="mt-3 text-fg-muted">
          L&apos;attestation est délivrée lorsque tous les chapitres du parcours sont validés ({totals.passed} / {totals.chapters} pour
          l&apos;instant) et que l&apos;examen final est réussi{finalExam ? ` (meilleur score : ${finalExam.best} %)` : ""}.
        </p>
        {chaptersDone ? (
          <Link href={`/examens/${parcours.slug}/final`} className="mt-8 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg">
            Passer l&apos;examen final
          </Link>
        ) : (
          <Link href={`/parcours/${parcours.slug}`} className="mt-8 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg">
            Continuer le parcours
          </Link>
        )}
      </div>
    );
  }

  if (!user.email_verified_at) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-fg">Confirmez votre adresse</h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Le parcours est terminé. L&apos;attestation est délivrée une fois l&apos;adresse électronique confirmée, pour qu&apos;elle ne
            repose pas sur un nom saisi sans vérification.
          </p>
          {emailNotice === "envoyee" && (
            <p className="mt-4 text-sm text-fg-muted">Un lien vient d&apos;être envoyé. Pensez à vérifier vos indésirables.</p>
          )}
          {emailNotice === "attente" && (
            <p className="mt-4 text-sm text-danger">Trop de demandes. Réessayez dans quelques minutes.</p>
          )}
          <form action={resendVerificationAction} className="mt-6">
            <input type="hidden" name="retour" value={`/certificat/${parcours.slug}`} />
            <button type="submit" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg">
              Recevoir le lien de confirmation
            </button>
          </form>
        </div>
      </div>
    );
  }

  const cert = await issueCertificate(user, course, { best: finalExam?.best ?? 0, first_pass: finalExam?.first_pass ?? null });
  if (cert.revoked_at) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-fg">Attestation révoquée</h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Votre attestation <span className="font-mono text-fg">{cert.code}</span> a été révoquée. Si vous pensez qu&apos;il s&apos;agit
            d&apos;une erreur, écrivez-nous via la page{" "}
            <Link href="/contact" className="font-medium text-brand hover:underline">
              Contact
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }
  const verifyUrl = `${await siteOrigin()}/verifier/${cert.code}`;
  const qr = await qrSvg(verifyUrl);

  return (
    <div className="cert-print-page mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono text-brand">Parcours terminé</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-fg sm:text-3xl">Votre attestation {parcours.title}</h1>
        </div>
        <p className="font-mono text-xs text-fg-muted">Identifiant {cert.code}</p>
      </div>

      <CertificateSheet cert={cert} qr={qr} />

      <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={linkedinAddUrl(cert, verifyUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
        >
          <LinkedinMark /> Ajouter à mon profil LinkedIn
        </a>
        <PrintButton />
        <CopyLinkButton url={verifyUrl} />
        <Link
          href={`/parcours/${parcours.slug}/synthese`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand-line hover:text-brand"
        >
          <PenLine className="size-4" aria-hidden /> Sketchnotes du parcours (PDF)
        </Link>
      </div>
      <p className="no-print mx-auto mt-4 max-w-xl text-center text-xs leading-relaxed text-fg-muted">
        Toute personne peut vérifier cette attestation en scannant le QR code ou en ouvrant{" "}
        <Link href={`/verifier/${cert.code}`} className="font-medium text-brand hover:underline">
          sa page de vérification
        </Link>
        . Pour un PDF, choisissez « Enregistrer au format PDF » dans la fenêtre d&apos;impression (format A4 paysage).
      </p>
    </div>
  );
}
