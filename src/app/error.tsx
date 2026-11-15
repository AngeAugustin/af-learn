"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-fg">Une erreur est survenue</h1>
      <p className="mt-3 text-fg-muted">
        Le service a rencontré un problème. Vérifiez que la base PostgreSQL est démarrée et configurée (voir le README), puis
        réessayez.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg hover:bg-brand-strong"
      >
        Réessayer
      </button>
    </div>
  );
}
