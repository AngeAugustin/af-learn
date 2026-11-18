import { mailFrom } from "@/lib/mail";
import { stripCode, unsafeMarkdown } from "@/lib/admin/markdown-guard";
import { isSafeHref } from "@/lib/markdown/safe-url";
import { clientIp } from "@/lib/request-ip";
import { describe, expect, it } from "vitest";
import { cleanCampaign, deviceFrom, isBot, isTrackablePath, referrerHost } from "@/lib/analytics";
import { csvCell, fmtRelative, toCsv } from "@/lib/admin/format";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";
const IPAD = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";
const ANDROID_TABLET = "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";
const DESKTOP = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

describe("mesure d'audience", () => {
  it("reconnaît le type d'appareil", () => {
    expect(deviceFrom(IPHONE)).toBe("mobile");
    expect(deviceFrom(IPAD)).toBe("tablet");
    expect(deviceFrom(ANDROID_TABLET)).toBe("tablet");
    expect(deviceFrom(DESKTOP)).toBe("desktop");
  });

  it("écarte les robots et les agents vides", () => {
    expect(isBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("curl/8.4.0")).toBe(true);
    expect(isBot("")).toBe(true);
    expect(isBot(DESKTOP)).toBe(false);
  });

  it("ne compte ni l'administration, ni l'API, ni les fichiers", () => {
    expect(isTrackablePath("/")).toBe(true);
    expect(isTrackablePath("/parcours/ai-engineering")).toBe(true);
    expect(isTrackablePath("/admin")).toBe(false);
    expect(isTrackablePath("/admin/apprenants")).toBe(false);
    expect(isTrackablePath("/api/collect")).toBe(false);
    expect(isTrackablePath("/icon.svg")).toBe(false);
    expect(isTrackablePath("https://ailleurs.fr/")).toBe(false);
  });

  it("ne garde que le nom d'hôte d'un référent externe", () => {
    expect(referrerHost("https://www.linkedin.com/feed/?x=1", "cursus.fr")).toBe("linkedin.com");
    expect(referrerHost("https://cursus.fr/parcours", "cursus.fr")).toBeNull();
    expect(referrerHost("http://localhost:3000/", "localhost:3000")).toBeNull();
    expect(referrerHost("pas une url", "cursus.fr")).toBeNull();
    expect(referrerHost("", "cursus.fr")).toBeNull();
  });

  it("nettoie la source de campagne", () => {
    expect(cleanCampaign(" LinkedIn ")).toBe("linkedin");
    expect(cleanCampaign("<script>")).toBe("script");
    expect(cleanCampaign("")).toBeNull();
  });
});

describe("export CSV", () => {
  it("échappe séparateurs, guillemets et retours à la ligne", () => {
    expect(csvCell("simple")).toBe("simple");
    expect(csvCell('a;b"c')).toBe('"a;b""c"');
    expect(csvCell(null)).toBe("");
  });

  it("neutralise les formules de tableur", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csvCell("+33")).toBe("'+33");
  });

  it("produit un fichier lisible par Excel (BOM, CRLF)", () => {
    const csv = toCsv([["nom", "email"], ["Ada", "ada@exemple.fr"]]);
    expect(csv.startsWith("﻿nom;email\r\n")).toBe(true);
    expect(csv.endsWith("Ada;ada@exemple.fr\r\n")).toBe(true);
  });
});

describe("dates relatives", () => {
  const now = new Date("2026-11-15T12:00:00Z").getTime();
  it("formate les durées écoulées", () => {
    expect(fmtRelative(null, now)).toBe("Jamais");
    expect(fmtRelative(new Date(now - 20_000), now)).toBe("à l'instant");
    expect(fmtRelative(new Date(now - 5 * 60_000), now)).toBe("il y a 5 min");
    expect(fmtRelative(new Date(now - 3 * 3600_000), now)).toBe("il y a 3 h");
    expect(fmtRelative(new Date(now - 4 * 86400_000), now)).toBe("il y a 4 j");
  });
});

describe("garde-fou Markdown du back office", () => {
  it("refuse le HTML actif", () => {
    expect(unsafeMarkdown("<script>alert(1)</script>")).toBe(true);
    expect(unsafeMarkdown('<img src="x" onerror="alert(1)">')).toBe(true);
    expect(unsafeMarkdown("<iframe src=https://exemple.com></iframe>")).toBe(true);
    expect(unsafeMarkdown("[clic](javascript:alert(1))")).toBe(true);
    expect(unsafeMarkdown('<a href="javascript:alert(1)">x</a>')).toBe(true);
    expect(unsafeMarkdown("```js\nok\n```\n<form action=/x>")).toBe(true);
    expect(unsafeMarkdown("<javascript:alert(1)>")).toBe(true);
    expect(unsafeMarkdown("[clic][x]\n\n[x]: javascript:alert(1)")).toBe(true);
    expect(unsafeMarkdown("<data:text/html,x>")).toBe(true);
  });

  it("n'accepte que des liens http, mailto ou internes", () => {
    expect(isSafeHref("https://exemple.fr/a")).toBe(true);
    expect(isSafeHref("mailto:a@b.fr")).toBe(true);
    expect(isSafeHref("/parcours/ia")).toBe(true);
    expect(isSafeHref("#methode")).toBe(true);
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("data:text/html,x")).toBe(false);
    expect(isSafeHref("//exemple.fr")).toBe(false);
    expect(isSafeHref("/\\exemple.fr")).toBe(false);
  });

  it("prend l'adresse posée par la plateforme, pas le premier maillon transmis par le client", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8", "x-real-ip": "9.9.9.9" });
    expect(clientIp(headers)).toBe("9.9.9.9");
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("5.6.7.8");
    expect(clientIp(new Headers())).toBe("local");
  });

  it("accepte le code d'exemple et le HTML de mise en forme", () => {
    expect(unsafeMarkdown("```html\n<script>alert(1)</script>\n```")).toBe(false);
    expect(unsafeMarkdown("Utilisez `<script>` avec prudence.")).toBe(false);
    expect(unsafeMarkdown("<details>\n<summary>Solution</summary>\n\nTexte\n</details>")).toBe(false);
    expect(unsafeMarkdown('<img src="/schema.png" alt="Schéma">')).toBe(false);
  });

  it("ignore un faux bloc de code imbriqué", () => {
    expect(stripCode("````\n```\n<script>\n```\n````\nfin")).toBe("fin");
  });
});

describe("expéditeur des emails", () => {
  it("préfère MAIL_FROM, sinon combine nom et adresse", () => {
    expect(mailFrom({ MAIL_FROM: "Cursus <a@b.fr>", RESEND_FROM_EMAIL: "x@y.fr" })).toBe("Cursus <a@b.fr>");
    expect(mailFrom({ RESEND_FROM_EMAIL: "noreply@exemple.fr", SMTP_FROM_NAME: "École" })).toBe("École <noreply@exemple.fr>");
    expect(mailFrom({ RESEND_FROM_EMAIL: "noreply@exemple.fr" })).toBe("noreply@exemple.fr");
    expect(mailFrom({})).toBeUndefined();
  });
});
