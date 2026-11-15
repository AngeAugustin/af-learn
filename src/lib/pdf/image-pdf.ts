/**
 * Génère un PDF contenant une ou plusieurs images JPEG, sans dépendance externe.
 * Chaque image devient une page A4 (portrait ou paysage selon le ratio), centrée avec une marge.
 */

const A4 = { short: 595.28, long: 841.89 };
const MARGIN = 28;

export type ImagePdfOptions = {
  title: string;
  author?: string;
};

export type PdfImagePage = {
  jpeg: Uint8Array;
  width: number;
  height: number;
};

/** Chaîne PDF en UTF-16BE (hexadécimal), pour les métadonnées accentuées. */
function pdfTextString(text: string): string {
  let hex = "FEFF";
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code > 0xffff) {
      const v = code - 0x10000;
      hex += (0xd800 + (v >> 10)).toString(16).padStart(4, "0") + (0xdc00 + (v & 0x3ff)).toString(16).padStart(4, "0");
    } else {
      hex += code.toString(16).padStart(4, "0");
    }
  }
  return `<${hex.toUpperCase()}>`;
}

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

/** PDF multi-pages : une page A4 par image JPEG. */
export function buildImagesPdf(pages: PdfImagePage[], options: ImagePdfOptions): Uint8Array {
  if (pages.length === 0) throw new Error("Le PDF doit contenir au moins une page");
  for (const page of pages) {
    if (page.jpeg[0] !== 0xff || page.jpeg[1] !== 0xd8) throw new Error("L'image doit être au format JPEG");
  }

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: string) => {
    offsets[id] = length;
    push(`${id} 0 obj\n${body}\nendobj\n`);
  };

  // Objets : 1 Catalog, 2 Pages, puis pour chaque page : Page, Image, Contents ; Info en dernier.
  const pageObjectIds = pages.map((_, i) => 3 + i * 3);
  const lastId = 2 + pages.length * 3 + 1;
  const date = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`);

  pages.forEach((page, i) => {
    const pageId = 3 + i * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const landscape = page.width > page.height;
    const pageW = landscape ? A4.long : A4.short;
    const pageH = landscape ? A4.short : A4.long;
    const scale = Math.min((pageW - 2 * MARGIN) / page.width, (pageH - 2 * MARGIN) / page.height);
    const drawW = page.width * scale;
    const drawH = page.height * scale;
    const x = (pageW - drawW) / 2;
    const y = pageH - MARGIN - drawH;
    const content = `q\n${fmt(drawW)} 0 0 ${fmt(drawH)} ${fmt(x)} ${fmt(y)} cm\n/Im0 Do\nQ\n`;

    object(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(pageW)} ${fmt(pageH)}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    offsets[imageId] = length;
    push(
      `${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`,
    );
    push(page.jpeg);
    push("\nendstream\nendobj\n");
    object(contentId, `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
  });

  object(
    lastId,
    `<< /Title ${pdfTextString(options.title)} /Author ${pdfTextString(options.author ?? "Cursus")} ` +
      `/Producer ${pdfTextString("Cursus")} /CreationDate (D:${date}Z) >>`,
  );

  const xref = length;
  let table = `xref\n0 ${lastId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= lastId; id++) table += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  push(table);
  push(`trailer\n<< /Size ${lastId + 1} /Root 1 0 R /Info ${lastId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) {
    out.set(chunk, position);
    position += chunk.length;
  }
  return out;
}

/** PDF d'une seule page (raccourci pour les sketchnotes de chapitre). */
export function buildImagePdf(jpeg: Uint8Array, imageWidth: number, imageHeight: number, options: ImagePdfOptions): Uint8Array {
  return buildImagesPdf([{ jpeg, width: imageWidth, height: imageHeight }], options);
}
