/**
 * Gabarit des emails Cursus : bandeau rouge avec le logo, carte blanche, bouton pleine largeur
 * et pied de page avec des liens utiles. Produit une version HTML (tableaux et styles en ligne,
 * le seul format bien affiché par Gmail, Outlook et les applications mobiles) et une version texte.
 *
 * Tout le contenu est échappé : un nom ou un message saisi par un visiteur ne peut pas injecter de HTML.
 */

export type EmailContent = {
  /** URL publique du site, sans barre finale (liens du pied de page). */
  origin: string;
  /** Résumé affiché par la messagerie à côté de l'objet. */
  preheader: string;
  title: string;
  greeting?: string;
  paragraphs?: string[];
  /** Petit tableau « libellé : valeur ». */
  facts?: [string, string][];
  /** Message cité (contact), sauts de ligne conservés. */
  quote?: string;
  button?: { label: string; url: string };
  /** Affiche aussi l'adresse brute du bouton, au cas où il ne s'ouvrirait pas. */
  showLink?: boolean;
  /** Remarque discrète sous le bouton. */
  note?: string;
  /** Mention de bas de page : email automatique ou notification interne. */
  footer?: "automatique" | "interne";
};

const C = {
  page: "#eff2ec",
  card: "#ffffff",
  brand: "#a41623",
  fg: "#172815",
  muted: "#5a6656",
  subtle: "#8c9688",
  soft: "#f4f6f1",
  line: "#e1e6dd",
};
const FONT = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** N'accepte que les liens http(s) et mailto ; tout autre schéma est neutralisé. */
export function safeUrl(url: string): string {
  return /^(https?:|mailto:)/i.test(url.trim()) ? url.trim() : "#";
}

const text = (s: string) => escapeHtml(s).replace(/\r?\n/g, "<br>");

export function renderEmail(c: EmailContent): { html: string; text: string } {
  return { html: renderHtml(c), text: renderText(c) };
}

function renderHtml(c: EmailContent): string {
  const origin = escapeHtml(safeUrl(c.origin));
  const p = (s: string, extra = "") =>
    `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.muted};${extra}">${text(s)}</p>`;

  const parts: string[] = [
    `<h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:${C.fg};">${text(c.title)}</h1>`,
  ];
  if (c.greeting) parts.push(p(c.greeting));
  for (const para of c.paragraphs ?? []) parts.push(p(para));

  if (c.facts?.length) {
    const rows = c.facts
      .map(
        ([k, v], i) =>
          `<tr><td style="padding:${i ? "0" : "12px"} 14px 12px;font-family:${FONT};font-size:13px;color:${C.muted};">${text(k)}</td>` +
          `<td align="right" style="padding:${i ? "0" : "12px"} 14px 12px;font-family:${FONT};font-size:13px;font-weight:600;color:${C.fg};word-break:break-word;">${text(v)}</td></tr>`,
      )
      .join("");
    parts.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:${C.soft};border-radius:8px;">${rows}</table>`,
    );
  }

  if (c.quote) {
    parts.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr>` +
        `<td style="background:${C.soft};border-left:3px solid ${C.brand};padding:14px 16px;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.fg};">${text(c.quote)}</td>` +
        `</tr></table>`,
    );
  }

  if (c.button) {
    const href = escapeHtml(safeUrl(c.button.url));
    parts.push(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 0;"><tr>` +
        `<td align="center" bgcolor="${C.brand}" style="border-radius:8px;">` +
        `<a href="${href}" target="_blank" style="display:block;padding:14px 20px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${text(c.button.label)}</a>` +
        `</td></tr></table>`,
    );
    if (c.showLink) {
      parts.push(
        `<p style="margin:16px 0 4px;font-family:${FONT};font-size:12px;line-height:1.5;color:${C.subtle};">Le bouton ne s'ouvre pas ? Copiez ce lien dans votre navigateur :</p>` +
          `<p style="margin:0;font-family:Consolas,'Courier New',monospace;font-size:12px;line-height:1.5;word-break:break-all;"><a href="${href}" style="color:${C.brand};">${escapeHtml(c.button.url)}</a></p>`,
      );
    }
  }

  if (c.note) {
    parts.push(
      `<p style="margin:20px 0 0;padding:14px 0 0;border-top:1px solid ${C.line};font-family:${FONT};font-size:12px;line-height:1.6;color:${C.subtle};">${text(c.note)}</p>`,
    );
  }

  const footerNote =
    c.footer === "interne"
      ? "Notification interne de la plateforme Cursus."
      : "Email automatique, merci de ne pas y répondre.";
  const link = (path: string, label: string) =>
    `<a href="${origin}${path}" style="color:${C.muted};text-decoration:underline;">${label}</a>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(c.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background:${C.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td bgcolor="${C.brand}" style="background:${C.brand};border-radius:12px 12px 0 0;padding:24px 28px 0;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td width="30" height="30" align="center" valign="middle" bgcolor="#ffffff" style="width:30px;height:30px;border-radius:8px;font-family:${FONT};font-size:16px;font-weight:700;color:${C.brand};">C</td>
<td style="padding-left:10px;font-family:${FONT};font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.2px;">Cursus</td>
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td height="24" bgcolor="${C.card}" style="height:24px;line-height:24px;font-size:0;border-radius:10px 10px 0 0;">&nbsp;</td></tr></table>
</td></tr>
<tr><td style="padding:0 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.card}" style="background:${C.card};border-radius:0 0 10px 10px;">
<tr><td style="padding:4px 24px 28px;">
${parts.join("\n")}
</td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:22px 28px 8px;font-family:${FONT};font-size:12px;line-height:1.8;color:${C.subtle};">
Cursus · Les métiers du numérique par la pratique<br>
${link("/parcours", "Parcours")} &nbsp;·&nbsp; ${link("/verifier", "Vérifier une attestation")} &nbsp;·&nbsp; ${link("/contact", "Contact")}<br>
${footerNote}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function renderText(c: EmailContent): string {
  const lines: string[] = [c.title, ""];
  if (c.greeting) lines.push(c.greeting, "");
  for (const para of c.paragraphs ?? []) lines.push(para, "");
  if (c.facts?.length) {
    for (const [k, v] of c.facts) lines.push(`${k} : ${v}`);
    lines.push("");
  }
  if (c.quote) lines.push(c.quote, "");
  if (c.button) lines.push(`${c.button.label} :`, c.button.url, "");
  if (c.note) lines.push(c.note, "");
  lines.push("Cursus · Les métiers du numérique par la pratique", c.origin);
  return lines.join("\n");
}
