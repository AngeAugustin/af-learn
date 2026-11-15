"use client";

import { useActionState, useState } from "react";
import { changePasswordAction, deleteAccountAction, updateProfileAction } from "@/app/actions/account";
import { FormMessage, SubmitButton, inputClass, type FormState } from "@/components/ui/form";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateProfileAction, {});
  const savedEmail = state.success ? (state.fields?.email ?? email) : email;
  const [currentEmail, setCurrentEmail] = useState(state.fields?.email ?? email);
  const emailChanged = currentEmail.trim().toLowerCase() !== savedEmail;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-fg">
          Nom
          <input name="name" autoComplete="name" required defaultValue={state.fields?.name ?? name} className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-fg-subtle">Il apparaît sur vos attestations.</span>
        </label>
        <label className="block text-sm font-medium text-fg">
          Adresse électronique
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      {emailChanged && (
        <label className="block text-sm font-medium text-fg">
          Mot de passe actuel
          <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-fg-subtle">Requis pour changer d&apos;adresse.</span>
        </label>
      )}
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Enregistrer</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(changePasswordAction, {});
  return (
    <form key={state.success ? "ok" : "edit"} action={formAction} className="space-y-4" noValidate>
      <label className="block text-sm font-medium text-fg">
        Mot de passe actuel
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-fg">
          Nouveau mot de passe
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
            placeholder="8 caractères minimum"
          />
        </label>
        <label className="block text-sm font-medium text-fg">
          Confirmer
          <input name="confirm" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
        </label>
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Changer le mot de passe</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(deleteAccountAction, {});
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger-soft"
      >
        Supprimer mon compte
      </button>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-danger/30 bg-danger-soft/40 p-4 sm:p-5" noValidate>
      <p className="text-sm leading-relaxed text-fg">
        Cette action est <strong>définitive</strong>. Votre progression, vos résultats, vos révisions et vos attestations seront
        effacés ; les identifiants de vos attestations ne pourront plus être vérifiés.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-fg">
          Tapez SUPPRIMER
          <input name="confirmation" autoComplete="off" required className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-fg">
          Mot de passe
          <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </label>
      </div>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton pending={pending} tone="danger">
          Supprimer définitivement
        </SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-fg-muted hover:bg-bg-muted"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
