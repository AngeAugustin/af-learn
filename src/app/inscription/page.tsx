import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Inscription" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ suivant?: string }> }) {
  const { suivant } = await searchParams;
  const next = safeNext(suivant, "/parcours/ai-engineering");
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell title="Créer votre compte" subtitle="Gratuit. Votre progression est enregistrée automatiquement.">
      <AuthForm mode="register" action={registerAction} next={next} />
      <p className="mt-6 text-center text-sm text-fg-muted">
        Déjà inscrit ?{" "}
        <Link href={`/connexion?suivant=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">
          Connectez-vous
        </Link>
      </p>
    </AuthShell>
  );
}
