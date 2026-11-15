import { describe, expect, it } from "vitest";
import { buildImagePdf, buildImagesPdf } from "@/lib/pdf/image-pdf";

// JPEG minimal (en-tête SOI + quelques octets) : suffisant pour vérifier la structure du PDF
const fakeJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9]);
const latin1 = (bytes: Uint8Array) => Array.from(bytes, (b) => String.fromCharCode(b)).join("");

describe("buildImagePdf", () => {
  it("produit un PDF valide dont la table xref pointe sur chaque objet", () => {
    const pdf = buildImagePdf(fakeJpeg, 1000, 1400, { title: "Sketchnote : Les principes du RAG" });
    const text = latin1(pdf);
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);

    const startxref = Number(/startxref\n(\d+)\n%%EOF/.exec(text)![1]);
    expect(text.slice(startxref, startxref + 4)).toBe("xref");
    const entries = text.slice(startxref).split("\n").slice(3, 9);
    entries.forEach((entry, i) => {
      const offset = Number(entry.slice(0, 10));
      expect(text.slice(offset, offset + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`);
    });
  });

  it("intègre l'image JPEG telle quelle avec la bonne longueur", () => {
    const pdf = buildImagePdf(fakeJpeg, 10, 20, { title: "Test" });
    const text = latin1(pdf);
    expect(text).toContain("/Filter /DCTDecode");
    expect(text).toContain(`/Length ${fakeJpeg.length}`);
    expect(text).toContain("/Width 10 /Height 20");
    const start = text.indexOf("stream\n") + "stream\n".length;
    expect(Array.from(pdf.slice(start, start + fakeJpeg.length))).toEqual(Array.from(fakeJpeg));
  });

  it("choisit l'orientation A4 selon l'image et encode le titre accentué", () => {
    expect(latin1(buildImagePdf(fakeJpeg, 1400, 1000, { title: "x" }))).toContain("/MediaBox [0 0 841.89 595.28]");
    const portrait = latin1(buildImagePdf(fakeJpeg, 1000, 1400, { title: "Évaluation" }));
    expect(portrait).toContain("/MediaBox [0 0 595.28 841.89]");
    expect(portrait).toContain("/Title <FEFF00C9"); // « É » en UTF-16BE
  });

  it("refuse une image qui n'est pas un JPEG", () => {
    expect(() => buildImagePdf(new Uint8Array([0x89, 0x50]), 1, 1, { title: "x" })).toThrow();
  });
});

describe("buildImagesPdf", () => {
  it("refuse un PDF sans page", () => {
    expect(() => buildImagesPdf([], { title: "x" })).toThrow();
  });

  it("produit un PDF multi-pages avec le bon Count et des xref valides", () => {
    const pages = [
      { jpeg: fakeJpeg, width: 1000, height: 1400 },
      { jpeg: fakeJpeg, width: 1400, height: 1000 },
      { jpeg: fakeJpeg, width: 800, height: 1200 },
    ];
    const pdf = buildImagesPdf(pages, { title: "Sketchnotes : AI Engineering" });
    const text = latin1(pdf);
    expect(text).toContain("/Count 3");
    expect(text).toContain("/MediaBox [0 0 595.28 841.89]");
    expect(text).toContain("/MediaBox [0 0 841.89 595.28]");

    const startxref = Number(/startxref\n(\d+)\n%%EOF/.exec(text)![1]);
    expect(text.slice(startxref, startxref + 4)).toBe("xref");
    // 1 Catalog + 1 Pages + 3×(Page+Image+Contents) + 1 Info = 12 objets
    const size = Number(/\/Size (\d+)/.exec(text)![1]);
    expect(size).toBe(13);
    for (let id = 1; id <= 12; id++) {
      expect(text).toContain(`${id} 0 obj`);
    }
  });
});
