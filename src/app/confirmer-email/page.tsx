import type { Metadata } from "next";
import Link from "next/link";
import { confirmEmailAction } from "@/app/actions/email";
import { AuthShell } from "@/components/auth/auth-shell";
import { findEmailVerification } from "@/lib/auth";

export const metadata: Metadata = { title: "Confirmer l'adresse", robots: { index: false } };

export default async function ConfirmEmailPage({ searchParams }: { searchParams: Promise<{ jeton?: string; etat?: string }> }) {
  const { jeton = "", etat } = await searchParams;
  const pending = etat === "invalide" ? null : await findEmailVerification(jeton);

  if (!pending) {
    return (
      <AuthShell title="Lien expiré" subtitle="Ce lien de confirmation n'est plus valable : il a expiré ou a déjà servi.">
        <Link
          href="/compte"
          className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
        >
          Retour au compte
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Confirmer votre adresse" subtitle={`Pour le compte ${pending.email}.`}>
      <form action={confirmEmailAction}>
        <input type="hidden" name="jeton" value={jeton} />
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
        >
          Confirmer mon adresse
        </button>
      </form>
    </AuthShell>
  );
}
