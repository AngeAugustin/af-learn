import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { findPasswordReset } from "@/lib/auth";
import { ResetPasswordForm } from "./reset-form";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton = "" } = await searchParams;
  const reset = await findPasswordReset(jeton);

  if (!reset) {
    return (
      <AuthShell title="Lien expiré" subtitle="Ce lien de réinitialisation n'est plus valable : il a expiré ou a déjà servi.">
        <Link
          href="/mot-de-passe-oublie"
          className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
        >
          Demander un nouveau lien
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choisir un nouveau mot de passe" subtitle={`Pour le compte ${reset.email}.`}>
      <ResetPasswordForm token={jeton} />
    </AuthShell>
  );
}
