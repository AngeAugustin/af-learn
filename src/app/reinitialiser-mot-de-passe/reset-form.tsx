"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/password";
import { FormMessage, SubmitButton, inputClass, type FormState } from "@/components/ui/form";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(resetPasswordAction, {});
  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="jeton" value={token} />
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
        Confirmer le mot de passe
        <input name="confirm" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
      </label>
      <FormMessage state={state} />
      <SubmitButton pending={pending} full>
        Enregistrer et me connecter
      </SubmitButton>
    </form>
  );
}
