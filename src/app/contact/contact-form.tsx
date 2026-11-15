"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { contactAction } from "@/app/actions/contact";
import { CONTACT_SUBJECTS } from "@/lib/contact";
import { FormMessage, SubmitButton, inputClass, type FormState } from "@/components/ui/form";

export function ContactForm({ defaults }: { defaults: { name?: string; email?: string; subject?: string } }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(contactAction, {});
  const f = state.fields ?? {};
  // Après un envoi réussi, on remet le formulaire à zéro (sauf nom et email).
  const key = state.success ? "sent" : "draft";

  return (
    <form key={key} action={formAction} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-fg">
          Nom
          <input name="name" autoComplete="name" required defaultValue={f.name ?? defaults.name} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-fg">
          Adresse électronique
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={f.email ?? defaults.email}
            className={inputClass}
            placeholder="vous@exemple.com"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-fg">
        Sujet
        <select name="subject" required defaultValue={f.subject ?? defaults.subject ?? ""} className={inputClass}>
          <option value="" disabled>
            Choisissez un sujet
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-fg">
        Message
        <textarea
          name="message"
          required
          rows={7}
          maxLength={5000}
          defaultValue={f.message}
          className={`${inputClass} resize-y`}
          placeholder="Décrivez votre demande. Pour un problème technique, indiquez la page concernée."
        />
      </label>
      {/* Champ piège pour les robots, masqué aux humains et aux lecteurs d'écran */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <FormMessage state={state} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-fg-subtle">Vos coordonnées servent uniquement à vous répondre.</p>
        <SubmitButton pending={pending}>
          <Send className="size-4" aria-hidden /> Envoyer le message
        </SubmitButton>
      </div>
    </form>
  );
}
