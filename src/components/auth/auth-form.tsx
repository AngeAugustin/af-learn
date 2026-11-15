"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AuthState } from "@/app/actions/auth";

type Props = {
  mode: "login" | "register";
  action: (state: AuthState, form: FormData) => Promise<AuthState>;
  next?: string;
};

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-fg shadow-sm outline-none transition placeholder:text-fg-subtle focus:border-brand focus:ring-4 focus:ring-[var(--ring)]";

export function AuthForm({ mode, action, next }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-4" noValidate>
      {next && <input type="hidden" name="suivant" value={next} />}
      {mode === "register" && (
        <label className="block text-sm font-medium text-fg">
          Nom
          <input
            name="name"
            autoComplete="name"
            required
            defaultValue={state.fields?.name}
            className={inputClass}
            placeholder="Votre nom"
          />
        </label>
      )}
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
      <label className="block text-sm font-medium text-fg">
        Mot de passe
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "register" ? 8 : undefined}
          className={inputClass}
          placeholder={mode === "register" ? "8 caractères minimum" : "••••••••"}
        />
      </label>
      {state.error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand-strong disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>
    </form>
  );
}
