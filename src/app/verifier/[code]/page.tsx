import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Ban, SearchX } from "lucide-react";
import { getCertificateByCode, qrSvg, siteOrigin } from "@/lib/certificates";
import { CERTIFICATE_CODE, normalizeCertificateCode } from "@/lib/certificate-code";
import { CertificateSheet } from "@/components/certificate/certificate-sheet";
import { VerifyForm } from "../verify-form";

// Page publique, mais inutile d'en faire indexer le contenu (nom de l'apprenant)
export const metadata: Metadata = { title: "Vérification d'attestation", robots: { index: false, follow: false } };

const formatDate = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(d));

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const code = normalizeCertificateCode(decodeURIComponent((await params).code));
  const cert = CERTIFICATE_CODE.test(code) ? await getCertificateByCode(code) : null;

  if (!cert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card p-6 text-center sm:p-8">
          <SearchX className="mx-auto size-10 text-danger" aria-hidden />
          <h1 className="mt-4 text-xl font-bold text-fg">Aucune attestation ne correspond</h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            L&apos;identifiant <span className="font-mono text-fg">{code || "(vide)"}</span> n&apos;a pas été délivré par Cursus. Vérifiez
            la saisie : il a la forme <span className="font-mono">CUR-AIE-7K4Q-M29X</span>.
          </p>
          <div className="mt-6">
            <VerifyForm defaultValue={code} />
          </div>
        </div>
      </div>
    );
  }

  if (cert.revoked_at) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-2.5 py-1 font-mono text-xs font-semibold text-danger">
            <Ban className="size-4" aria-hidden /> Attestation révoquée
          </span>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-fg">Cette attestation n&apos;est plus valide</h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            L&apos;attestation <span className="font-mono text-fg">{cert.code}</span> ({cert.parcours_title}) a été délivrée le{" "}
            {formatDate(cert.issued_at)}, puis révoquée par Cursus le {formatDate(cert.revoked_at)}. Elle ne peut plus être présentée comme
            preuve de réussite.
          </p>
        </div>
      </div>
    );
  }

  const verifyUrl = `${await siteOrigin()}/verifier/${cert.code}`;
  const qr = await qrSvg(verifyUrl);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="card mx-auto mb-8 max-w-2xl p-5 sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-md border border-success-line bg-success-soft px-2.5 py-1 font-mono text-xs font-semibold text-success">
          <BadgeCheck className="size-4" aria-hidden /> Attestation authentique
        </span>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-fg sm:text-2xl">
          {cert.holder_name} · {cert.parcours_title}
        </h1>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
          <dt className="font-mono text-xs leading-5 text-fg-subtle">Identifiant</dt>
          <dd className="font-mono text-fg">{cert.code}</dd>
          <dt className="font-mono text-xs leading-5 text-fg-subtle">Délivrée le</dt>
          <dd className="text-fg">{formatDate(cert.issued_at)}</dd>
          <dt className="font-mono text-xs leading-5 text-fg-subtle">Parcours</dt>
          <dd className="text-fg">
            {cert.module_count} modules, {cert.chapter_count} chapitres validés, examen final {cert.final_score} %
          </dd>
          <dt className="font-mono text-xs leading-5 text-fg-subtle">Émetteur</dt>
          <dd className="text-fg">Cursus</dd>
        </dl>
        <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-fg-muted">
          Cette page est générée par Cursus à partir de ses propres registres : elle fait foi.{" "}
          <Link href={`/parcours/${cert.parcours_slug}`} className="font-medium text-brand hover:underline">
            Voir le programme du parcours
          </Link>
        </p>
      </section>
      <CertificateSheet cert={cert} qr={qr} />
    </div>
  );
}
