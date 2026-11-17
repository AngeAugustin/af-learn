import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { normalizeCertificateCode } from "@/lib/certificate-code";
import { countValidCertificates } from "@/lib/certificates";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = {
  title: "Vérifier une attestation",
  description: "Confirmez en quelques secondes qu'une attestation Cursus est authentique, à partir de son identifiant ou de son QR code.",
};
export const dynamic = "force-dynamic";

const STEPS = [
  ["Trouvez l'identifiant", "Il est imprimé sous le QR code, en bas de l'attestation. Il commence par CUR."],
  ["Comparé au registre", "Nous le cherchons dans nos propres archives : aucune donnée n'est déclarée par l'apprenant."],
  ["Résultat immédiat", "Authentique, révoquée ou inconnue, avec le détail du parcours réussi."],
] as const;

export default async function VerifyIndexPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  if (code?.trim()) redirect(`/verifier/${encodeURIComponent(normalizeCertificateCode(code))}`);
  const issued = await countValidCertificates().catch(() => 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <ShieldCheck className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-fg sm:text-4xl">Vérifier une attestation Cursus</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
          Recruteur, école ou client : confirmez en quelques secondes qu&apos;une attestation a bien été délivrée par Cursus.
        </p>
      </div>

      <div className="card mx-auto mt-8 max-w-xl p-4 sm:p-5">
        <VerifyForm autoFocus scan />
      </div>

      <ol className="mt-10 grid gap-3 sm:grid-cols-3">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="card p-4">
            <span className="font-mono text-xs font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-1.5 text-sm font-semibold text-fg">{title}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{text}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center font-mono text-xs text-fg-subtle">
        {issued > 0 && <>{issued.toLocaleString("fr-FR")} attestation{issued > 1 ? "s" : ""} délivrée{issued > 1 ? "s" : ""} · </>}
        Vérification gratuite, sans compte
      </p>
    </div>
  );
}
