import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, Ban, BadgeCheck, Check, FileDown, SearchX } from "lucide-react";
import { getCertificateByCode, getParcoursModuleTitles, qrSvg, siteOrigin } from "@/lib/certificates";
import { CERTIFICATE_CODE, normalizeCertificateCode } from "@/lib/certificate-code";
import { CertificateSheet } from "@/components/certificate/certificate-sheet";
import { CopyLinkButton } from "@/components/certificate/copy-link-button";
import { PrintButton } from "@/components/ui/print-button";
import { VerifyForm } from "../verify-form";
import { VerifiedAt } from "./verified-at";

// Page publique, mais inutile d'en faire indexer le contenu (nom de l'apprenant)
export const metadata: Metadata = { title: "Vérification d'attestation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const formatDate = (d: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(d));

function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-mono text-xs leading-5 text-fg-subtle">{k}</dt>
          <dd className="text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const code = normalizeCertificateCode(decodeURIComponent((await params).code));
  const cert = CERTIFICATE_CODE.test(code) ? await getCertificateByCode(code) : null;
  const checkedAt = new Date().toISOString();

  if (!cert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border bg-accent-soft px-5 py-3.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-accent text-white">
              <SearchX className="size-4" aria-hidden />
            </span>
            <h1 className="text-base font-bold text-fg">Aucune attestation ne correspond</h1>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-fg-muted">
              L&apos;identifiant <span className="font-mono font-semibold text-fg">{code || "(vide)"}</span> ne figure pas dans le registre
              de Cursus.
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-fg-muted">
              <li>· Il a la forme <span className="font-mono text-fg">CUR-AIE-7K4Q-M29X</span> : quatre groupes séparés par des tirets.</li>
              <li>· Les chiffres 0 et 1 et les lettres O, I et L n&apos;y figurent jamais.</li>
              <li>· Le plus sûr reste de scanner le QR code imprimé sur l&apos;attestation.</li>
            </ul>
            <div className="mt-6">
              <VerifyForm defaultValue={code} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cert.revoked_at) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-danger/25 bg-danger-soft px-5 py-3.5">
            <span className="flex items-center gap-3 text-base font-bold text-danger">
              <span className="flex size-8 items-center justify-center rounded-full bg-danger text-white">
                <Ban className="size-4" aria-hidden />
              </span>
              Attestation révoquée
            </span>
            <span className="font-mono text-[11px] text-danger">
              Vérifiée le <VerifiedAt iso={checkedAt} />
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <h1 className="text-xl font-bold tracking-tight text-fg">Cette attestation n&apos;est plus valide</h1>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Elle ne peut plus être présentée comme preuve de réussite.
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <Facts
                rows={[
                  ["Identifiant", <span key="c" className="font-mono">{cert.code}</span>],
                  ["Parcours", cert.parcours_title],
                  ["Délivrée le", formatDate(cert.issued_at)],
                  ["Révoquée le", formatDate(cert.revoked_at)],
                  ...(cert.revoked_reason ? ([["Motif", cert.revoked_reason]] as [string, string][]) : []),
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const verifyUrl = `${await siteOrigin()}/verifier/${cert.code}`;
  const [qr, modules] = await Promise.all([qrSvg(verifyUrl), getParcoursModuleTitles(cert.parcours_id)]);
  const stats: [string, string][] = [
    ["Examen final", `${cert.final_score} %`],
    ["Moyenne", `${cert.average_score} %`],
    ["Chapitres", `${cert.chapter_count} / ${cert.chapter_count}`],
    ["Volume", `≈ ${Math.max(1, Math.round(cert.minutes / 60))} h`],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="card mx-auto max-w-2xl overflow-hidden print:max-w-none print:border-0 print:shadow-none" aria-labelledby="titulaire">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success-line bg-success-soft px-5 py-3.5 print-color-exact">
          <span className="flex items-center gap-3 text-base font-bold text-success">
            <span className="flex size-8 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-4" strokeWidth={3} aria-hidden />
            </span>
            Attestation authentique
          </span>
          <span className="font-mono text-[11px] text-success">
            Vérifiée le <VerifiedAt iso={checkedAt} />
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pb-5 pt-6 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">Délivrée à</p>
            <h1 id="titulaire" className="mt-1 text-2xl font-bold tracking-[-0.03em] text-fg sm:text-[28px]">
              {cert.holder_name}
            </h1>
            <p className="mt-1.5 text-sm text-fg-muted">
              a réussi le parcours <span className="font-semibold text-fg">{cert.parcours_title}</span>
            </p>
          </div>
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-brand text-brand" aria-hidden>
            <BadgeCheck className="size-8" />
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-px border-y border-border bg-border sm:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k} className="bg-bg-elevated px-5 py-3 sm:px-6">
              <dt className="text-[11px] text-fg-subtle">{k}</dt>
              <dd className="mt-0.5 text-lg font-bold tabular-nums text-fg">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="px-5 py-5 sm:px-6">
          {modules.length > 0 && (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                {cert.module_count} modules validés
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {modules.map((m) => (
                  <li key={m} className="inline-flex items-center gap-1 rounded-full bg-bg-muted px-2.5 py-1 text-xs text-fg">
                    <Check className="size-3 text-success" strokeWidth={3} aria-hidden /> {m}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-5">
            <Facts
              rows={[
                ["Identifiant", <span key="c" className="font-mono">{cert.code}</span>],
                ["Délivrée le", formatDate(cert.issued_at)],
                ["Émetteur", "Cursus"],
                ...(cert.email_confirmed ? ([["Adresse", "Confirmée avant délivrance"]] as [string, string][]) : []),
                ["Programme", <Link key="p" href={`/parcours/${cert.parcours_slug}`} className="font-medium text-brand hover:underline">Voir le programme du parcours</Link>],
              ]}
            />
          </div>
          <p className="mt-5 border-t border-border pt-3 text-xs leading-relaxed text-fg-muted">
            Ce résultat est produit par Cursus à partir de son propre registre au moment de la consultation : il fait foi.
            <span className="hidden print:inline"> Adresse de vérification : {verifyUrl}</span>
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2 border-t border-border bg-bg-muted/60 px-5 py-3.5 sm:px-6">
          <CopyLinkButton url={verifyUrl} />
          <PrintButton
            icon={<FileDown className="size-4" aria-hidden />}
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-muted"
          >
            Preuve de vérification (PDF)
          </PrintButton>
          <a href="#attestation" className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-semibold text-brand hover:underline">
            Voir l&apos;attestation <ArrowDown className="size-4" aria-hidden />
          </a>
        </div>
      </section>

      <div id="attestation" className="no-print mt-10 scroll-mt-24">
        <CertificateSheet cert={cert} qr={qr} />
      </div>
    </div>
  );
}
