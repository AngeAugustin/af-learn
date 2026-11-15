import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suivant?: string }> }) {
  const { suivant } = await searchParams;
  const next = safeNext(suivant);
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell title="Bon retour parmi nous" subtitle="Connectez-vous pour reprendre votre progression.">
      <AuthForm mode="login" action={loginAction} next={next} />
      <p className="mt-4 text-center text-sm">
        <Link href="/mot-de-passe-oublie" className="font-medium text-fg-muted hover:text-brand hover:underline">
          Mot de passe oublié ?
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-fg-muted">
        Pas encore de compte ?{" "}
        <Link href={`/inscription?suivant=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">
          Inscrivez-vous gratuitement
        </Link>
      </p>
    </AuthShell>
  );
}
