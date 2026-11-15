import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RequestResetForm } from "./request-form";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Indiquez l'adresse de votre compte : nous vous enverrons un lien pour en choisir un nouveau."
    >
      <RequestResetForm />
      <p className="mt-6 text-center text-sm text-fg-muted">
        Ça vous revient ?{" "}
        <Link href="/connexion" className="font-semibold text-brand hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthShell>
  );
}
