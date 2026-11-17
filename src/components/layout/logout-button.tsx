"use client";

import { useId, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const DEFAULT_TEXT =
  "Votre progression est enregistrée. Vous devrez saisir à nouveau votre adresse et votre mot de passe pour reprendre votre formation.";

/**
 * Bouton de déconnexion qui demande confirmation dans une fenêtre modale.
 * Utilise <dialog> : focus piégé, touche Échap et couche supérieure gérés par le navigateur.
 */
export function LogoutButton({
  className,
  children,
  label = "Déconnexion",
  action = logoutAction,
  title = "Se déconnecter ?",
  text = DEFAULT_TEXT,
  confirmLabel = "Se déconnecter",
}: {
  className: string;
  children: ReactNode;
  /** Nom accessible et infobulle du bouton (utile quand il ne contient qu'une icône). */
  label?: string;
  action?: () => Promise<void>;
  title?: string;
  text?: string;
  confirmLabel?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const textId = useId();

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className={className} title={label} aria-label={typeof children === "string" ? undefined : label} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={textId}
        // Un clic sur le fond (hors de la boîte) referme la fenêtre.
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        // Échap ne doit refermer que la fenêtre, pas le menu mobile qui l'a ouverte.
        onKeyDown={(e) => e.key === "Escape" && e.stopPropagation()}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-bg-elevated p-0 text-fg shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <LogOut className="size-5" aria-hidden />
          </span>
          <h2 id={titleId} className="mt-4 text-lg font-bold tracking-tight text-fg">
            {title}
          </h2>
          <p id={textId} className="mt-1.5 text-sm leading-relaxed text-fg-muted">
            {text}
          </p>
          <form action={action} className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              className="rounded-lg border border-border-strong bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-bg-muted"
            >
              Annuler
            </button>
            <SubmitButton label={confirmLabel} />
          </form>
        </div>
      </dialog>
    </>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Déconnexion…" : label}
    </button>
  );
}
