import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { normalizeCertificateCode } from "@/lib/certificate-code";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = { title: "Vérifier une attestation" };

export default async function VerifyIndexPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  if (code?.trim()) redirect(`/verifier/${encodeURIComponent(normalizeCertificateCode(code))}`);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="card p-6 sm:p-8">
        <ShieldCheck className="size-10 text-brand" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-fg">Vérifier une attestation</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Saisissez l&apos;identifiant imprimé sur l&apos;attestation (sous le QR code) pour confirmer qu&apos;elle a bien été délivrée par
          Cursus.
        </p>
        <div className="mt-6">
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
