import { describe, expect, it } from "vitest";
import { escapeHtml, renderEmail, safeUrl } from "@/lib/email-template";

const base = { origin: "https://cursus.example", preheader: "Résumé", title: "Titre" };

describe("gabarit des emails", () => {
  it("échappe le contenu saisi par un visiteur", () => {
    const { html } = renderEmail({
      ...base,
      title: "<script>alert(1)</script>",
      facts: [["De", `Eve "<img src=x onerror=alert(1)>"`]],
      quote: "Bonjour\n<b>gras</b>",
    });
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<b>gras</b>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Bonjour<br>&lt;b&gt;");
  });

  it("neutralise les liens dangereux", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("#");
    expect(safeUrl("https://cursus.example/a")).toBe("https://cursus.example/a");
    expect(safeUrl("mailto:a@b.c")).toBe("mailto:a@b.c");
    const { html } = renderEmail({ ...base, button: { label: "Go", url: "javascript:alert(1)" } });
    expect(html).not.toContain('href="javascript:');
  });

  it("produit aussi une version texte avec le lien", () => {
    const url = "https://cursus.example/reinitialiser-mot-de-passe?jeton=abc";
    const { text, html } = renderEmail({ ...base, greeting: "Bonjour Awa,", button: { label: "Choisir", url }, showLink: true });
    expect(text).toContain("Bonjour Awa,");
    expect(text).toContain(url);
    expect(html).toContain(escapeHtml(url));
    expect(html).toContain("https://cursus.example/verifier");
  });

  it("ne contient aucun tiret cadratin", () => {
    const { html, text } = renderEmail({ ...base, note: "Note", footer: "interne" });
    expect(html + text).not.toContain(String.fromCharCode(0x2014));
  });
});
