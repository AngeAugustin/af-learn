"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { buildImagePdf } from "@/lib/pdf/image-pdf";
import { rasterizeSketchnoteFigure, triggerPdfDownload } from "@/lib/pdf/sketchnote-canvas";

/**
 * Télécharge la sketchnote voisine en PDF : copie hors écran en thème clair, rendu en image
 * haute résolution, puis assemblage d'un PDF A4 directement dans le navigateur.
 */
export function SketchnoteDownload({ title, fileName }: { title: string; fileName: string }) {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  async function download(event: React.MouseEvent<HTMLButtonElement>) {
    const figure = event.currentTarget.closest("[data-sketchnote-root]")?.querySelector("figure");
    if (!figure) return;
    setState("working");
    try {
      const page = await rasterizeSketchnoteFigure(figure, `Cursus · ${title} · sketchnote de fin de chapitre`);
      const pdf = buildImagePdf(page.jpeg, page.width, page.height, { title: `Sketchnote : ${title}` });
      triggerPdfDownload(pdf, fileName);
      setState("idle");
    } catch (error) {
      console.error(error);
      setState("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={download}
        disabled={state === "working"}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2 text-sm font-semibold text-fg shadow-card transition hover:border-brand-line hover:text-brand disabled:cursor-wait disabled:opacity-70"
      >
        {state === "working" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Download className="size-4" aria-hidden />}
        {state === "working" ? "Préparation du PDF…" : "Télécharger en PDF"}
      </button>
      {state === "error" && (
        <p role="alert" className="text-xs text-danger">
          Le PDF n&apos;a pas pu être généré. Réessayez, ou utilisez l&apos;impression du navigateur.
        </p>
      )}
    </div>
  );
}
