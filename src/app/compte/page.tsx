import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Download, KeyRound, LogOut, Trash2, UserRound } from "lucide-react";
import { logoutEverywhereAction } from "@/app/actions/account";
import { resendVerificationAction } from "@/app/actions/email";
import { LogoutButton } from "@/components/layout/logout-button";
import { requireUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "./account-forms";

export const metadata: Metadata = { title: "Mon compte" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

function Panel({ id, icon, title, intro, children, danger }: {
  id: string;
  icon: ReactNode;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <section id={id} className={`card scroll-mt-24 p-6 sm:p-8 ${danger ? "border-danger/30" : ""}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${danger ? "bg-danger-soft text-danger" : "bg-brand-soft text-brand"}`}
        >
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-fg">{title}</h2>
          <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">{intro}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ "mot-de-passe"?: string; email?: string }> }) {
  const user = await requireUser("/compte");
  const params = await searchParams;
  const stats = await queryOne<{ sections: number; certificates: number }>(
    `SELECT (SELECT count(*)::int FROM section_progress WHERE user_id = $1) AS sections,
            (SELECT count(*)::int FROM certificates WHERE user_id = $1) AS certificates`,
    [user.id],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="label-mono text-brand">Paramètres</p>
      <h1 className="mt-2.5 text-3xl font-bold tracking-[-0.035em] text-fg">Mon compte</h1>
      <p className="mt-2 text-sm text-fg-muted">
        Membre depuis le {dateFormat.format(new Date(user.created_at))} · {stats?.sections ?? 0} sections lues ·{" "}
        {stats?.certificates ?? 0} attestation{(stats?.certificates ?? 0) > 1 ? "s" : ""}
      </p>

      {!user.email_verified_at && (
        <div className="mt-6 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-fg">
          <p>Votre adresse n&apos;est pas encore confirmée. Elle le sera avant qu&apos;une attestation puisse être délivrée.</p>
          <form action={resendVerificationAction} className="mt-3">
            <button type="submit" className="text-sm font-semibold text-brand hover:underline">
              Renvoyer le lien de confirmation
            </button>
          </form>
        </div>
      )}

      {params.email === "confirmee" && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-lg bg-success-soft px-4 py-3 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden /> Adresse électronique confirmée.
        </p>
      )}
      {params.email === "envoyee" && (
        <p role="status" className="mt-6 rounded-lg bg-bg-muted px-4 py-3 text-sm text-fg-muted">
          Un nouveau lien de confirmation a été envoyé. Pensez à vérifier vos indésirables.
        </p>
      )}
      {params.email === "attente" && (
        <p role="status" className="mt-6 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
          Trop de demandes. Réessayez dans quelques minutes.
        </p>
      )}

      {params["mot-de-passe"] === "modifie" && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-lg bg-success-soft px-4 py-3 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden /> Votre mot de passe a été réinitialisé et vous êtes connecté.
        </p>
      )}

      <div className="mt-8 space-y-6">
        <Panel id="profil" icon={<UserRound className="size-[18px]" aria-hidden />} title="Profil" intro="Votre nom et l'adresse utilisée pour vous connecter.">
          <ProfileForm name={user.name} email={user.email} />
        </Panel>

        <Panel
          id="securite"
          icon={<KeyRound className="size-[18px]" aria-hidden />}
          title="Mot de passe et sessions"
          intro="Changer de mot de passe déconnecte automatiquement vos autres appareils."
        >
          <PasswordForm />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <p className="text-sm text-fg-muted">Un appareil perdu ou partagé ? Fermez toutes les sessions ouvertes.</p>
            <LogoutButton
              action={logoutEverywhereAction}
              label="Se déconnecter partout"
              title="Se déconnecter partout ?"
              text="Toutes vos sessions seront fermées, sur cet appareil comme sur les autres. Votre progression est enregistrée."
              confirmLabel="Tout déconnecter"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand hover:text-brand"
            >
              <LogOut className="size-4" aria-hidden /> Se déconnecter partout
            </LogoutButton>
          </div>
        </Panel>

        <Panel
          id="donnees"
          icon={<Download className="size-[18px]" aria-hidden />}
          title="Mes données"
          intro={
            <>
              Téléchargez tout ce que nous conservons sur vous : profil, progression, résultats, révisions, attestations et messages.
              Voir la{" "}
              <Link href="/confidentialite" className="font-medium text-brand hover:underline">
                politique de confidentialité
              </Link>
              .
            </>
          }
        >
          <a
            href="/compte/export"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong"
          >
            <Download className="size-4" aria-hidden /> Télécharger mes données (JSON)
          </a>
        </Panel>

        <Panel
          id="suppression"
          danger
          icon={<Trash2 className="size-[18px]" aria-hidden />}
          title="Supprimer mon compte"
          intro="Efface définitivement votre compte et toutes les données associées."
        >
          <DeleteAccountForm />
        </Panel>
      </div>
    </div>
  );
}
