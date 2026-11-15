"use client";

import { useActionState } from "react";
import { requestResetAction } from "@/app/actions/password";
import { FormMessage, SubmitButton, inputClass, type FormState } from "@/components/ui/form";

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(requestResetAction, {});
  if (state.success) return <FormMessage state={state} />;
  return (
    <form action={formAction} className="space-y-4" noValidate>
      <label className="block text-sm font-medium text-fg">
        Adresse électronique
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.fields?.email}
          className={inputClass}
          placeholder="vous@exemple.com"
        />
      </label>
      <FormMessage state={state} />
      <SubmitButton pending={pending} full>
        Recevoir le lien
      </SubmitButton>
    </form>
  );
}
