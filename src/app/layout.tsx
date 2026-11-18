import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "@fontsource-variable/sora";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/caveat";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Analytics } from "@/components/layout/analytics";

export const metadata: Metadata = {
  title: {
    default: "Cursus · Se former aux métiers du numérique",
    template: "%s · Cursus",
  },
  description:
    "Plateforme d'apprentissage en ligne : parcours structurés en modules, chapitres et sections, illustrations, exercices corrigés et évaluations validées à 75 %.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e180d" },
  ],
};

// Applique le thème avant le premier rendu pour éviter un flash de couleurs
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-md bg-brand px-3 py-2 text-brand-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
