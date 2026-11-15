/**
 * Rasterise une figure sketchnote hors écran (thème clair + pied de page), pour assemblage PDF.
 * Utilisé par le téléchargement d'une page et par la synthèse multi-pages.
 */

export type SketchnoteCanvasResult = {
  jpeg: Uint8Array;
  width: number;
  height: number;
};

export async function rasterizeSketchnoteFigure(
  figure: HTMLElement,
  footerText: string,
): Promise<SketchnoteCanvasResult> {
  const { toCanvas } = await import("html-to-image");
  await document.fonts.ready;

  const host = document.createElement("div");
  try {
    const clone = figure.cloneNode(true) as HTMLElement;
    clone.classList.add("force-light");
    clone.style.margin = "0";
    clone.style.boxShadow = "none";
    const footer = document.createElement("p");
    footer.className = "sketch-font relative mt-6 text-center text-base text-[var(--sketch-muted)]";
    footer.textContent = footerText;
    clone.appendChild(footer);
    host.style.cssText = `position:fixed;left:-20000px;top:0;width:${Math.max(figure.offsetWidth, 760)}px;`;
    host.className = "force-light";
    host.appendChild(clone);
    document.body.appendChild(host);

    const canvas = await toCanvas(clone, {
      pixelRatio: 2.5,
      backgroundColor: getComputedStyle(clone).backgroundColor || "#fffdf7",
      cacheBust: true,
    });
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const jpeg = Uint8Array.from(atob(dataUrl.split(",")[1]), (c) => c.charCodeAt(0));
    return { jpeg, width: canvas.width, height: canvas.height };
  } finally {
    host.remove();
  }
}

export function triggerPdfDownload(pdf: Uint8Array, fileName: string) {
  const url = URL.createObjectURL(new Blob([pdf as BlobPart], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
