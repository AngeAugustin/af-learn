/** Formulaire de saisie d'un identifiant d'attestation (GET vers /verifier). */
export function VerifyForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/verifier" method="get" className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="code" className="sr-only">
        Identifiant de l&apos;attestation
      </label>
      <input
        id="code"
        name="code"
        defaultValue={defaultValue}
        placeholder="CUR-AIE-7K4Q-M29X"
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 rounded-lg border border-border-strong bg-bg-elevated px-3.5 py-2.5 font-mono text-sm uppercase text-fg outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
      />
      <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong">
        Vérifier
      </button>
    </form>
  );
}
