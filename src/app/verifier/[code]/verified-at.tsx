"use client";

/** Date et heure de la vérification, affichées dans le fuseau du visiteur. */
export function VerifiedAt({ iso }: { iso: string }) {
  const text = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
