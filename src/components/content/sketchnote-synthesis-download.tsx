"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { buildImagesPdf } from "@/lib/pdf/image-pdf";
import { rasterizeSketchnoteFigure, triggerPdfDownload } from "@/lib/pdf/sketchnote-canvas";

/**
 * Assemble toutes les sketchnotes de la page (une page PDF chacune) en un seul fichier.
 * Les figures doivent porter data-sketchnote-root, dans l'ordre d'affichage.
 */
export function SketchnoteSynthesisDownload({
  title,
  fileName,
  pageCount,
}: {
  title: string;
  fileName: string;
  pageCount: number;
}) {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const [progress, setProgress] = useState(0);

  async function download() {
    const roots = [...document.querySelectorAll<HTMLElement>("[data-synthesis-sketchnote]")];
    if (roots.length === 0) return;
    setState("working");
    setProgress(0);
    try {
      const pages = [];
      for (let i = 0; i < roots.length; i++) {
        const figure = roots[i].querySelector("figure");
        if (!figure) throw new Error(`Sketchnote ${i + 1} introuvable`);
        const chapterTitle = roots[i].dataset.chapterTitle ?? title;
        const moduleTitle = roots[i].dataset.moduleTitle ?? "";
        const footer = moduleTitle
          ? `Cursus · ${title} · ${moduleTitle} · ${chapterTitle}`
          : `Cursus · ${title} · ${chapterTitle}`;
        pages.push(await rasterizeSketchnoteFigure(figure, footer));
        setProgress(i + 1);
      }
      const pdf = buildImagesPdf(pages, { title: `Sketchnotes : ${title}` });
      triggerPdfDownload(pdf, fileName);
      setState("idle");
      setProgress(0);
    } catch (error) {
      console.error(error);
      setState("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={download}
        disabled={state === "working"}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg shadow-card transition hover:bg-brand-strong disabled:cursor-wait disabled:opacity-70"
      >
        {state === "working" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Download className="size-4" aria-hidden />}
        {state === "working"
          ? `Préparation… ${progress}/${pageCount}`
          : `Télécharger le PDF (${pageCount} pages)`}
      </button>
      {state === "error" && (
        <p role="alert" className="text-xs text-danger">
          Le PDF n&apos;a pas pu être généré. Réessayez dans un instant.
        </p>
      )}
    </div>
  );
}
