import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, Fragment } from "react";
import { renderMarkdown } from "@/lib/markdown/render";
import { loadAllParcours } from "@/lib/content/loader";

async function html(markdown: string) {
  return renderToStaticMarkup(createElement(Fragment, null, await renderMarkdown(markdown)));
}

describe("rendu Markdown", () => {
  it("rend les encadrés au format GitHub", async () => {
    const out = await html("> [!TIP]\n> Un conseil **utile**.");
    expect(out).toContain('role="note"');
    expect(out).toContain("Conseil");
    expect(out).toContain("<strong>utile</strong>");
    expect(out).not.toContain("[!TIP]");
  });

  it("colore le code et affiche le langage", async () => {
    const out = await html("```python\nprint('bonjour')\n```");
    expect(out).toContain("python");
    expect(out).toContain("--shiki-light");
    expect(out).toContain("print");
  });

  it("transforme les blocs diagram en figures", async () => {
    const out = await html("```diagram\ntype: flow\ntitle: Test\nsteps:\n  - title: A\n  - title: B\n```");
    expect(out).toContain("<figure");
    expect(out).toContain("Test");
    expect(out).not.toContain("type: flow");
  });

  it("rend les tableaux, les solutions repliables et les liens externes", async () => {
    const out = await html(
      "| a | b |\n|---|---|\n| 1 | 2 |\n\n<details>\n<summary>Voir la solution</summary>\n\nRéponse **ici**.\n\n</details>\n\n[doc](https://example.com)",
    );
    expect(out).toContain('class="table-wrap"');
    expect(out).toContain("Voir la solution</span>");
    expect(out).toContain("<strong>ici</strong>");
    expect(out).toContain('target="_blank"');
  });

  it("rend toutes les sections du parcours sans erreur ni diagramme invalide", async () => {
    const sections = loadAllParcours().flatMap((p) => p.modules.flatMap((m) => m.chapters.flatMap((c) => c.sections)));
    expect(sections.length).toBeGreaterThan(100);
    for (const s of sections) {
      const out = await html(s.body);
      expect(out, s.slug).not.toContain("Diagramme invalide");
      expect(out.length, s.slug).toBeGreaterThan(100);
    }
  }, 180_000);
});

describe("rendu des exercices et du sommaire", () => {
  it("transforme les exercices en cartes numérotées avec solution repliable", async () => {
    const out = await html("## Exercice 2 : Calculer un score\n\nÉnoncé.\n\n<details>\n<summary>Voir la solution</summary>\n\nRéponse.\n\n</details>\n\n## Autre titre\n\nTexte.");
    expect(out).toContain('class="exercise-card"');
    expect(out).toContain("Exercice 2");
    expect(out).toContain("Calculer un score");
    expect(out).toContain('class="solution"');
    expect(out).toContain('class="solution-body"');
    // Le titre suivant n'est pas absorbé dans la carte
    expect(out.indexOf("Autre titre")).toBeGreaterThan(out.indexOf("</section>"));
  });

  it("produit un sommaire dont les ancres correspondent au rendu", async () => {
    const { extractOutline } = await import("@/lib/markdown/outline");
    const md = "## Premier titre\n\n```python\n## pas un titre\n```\n\n### Sous-titre\n\n## Exercice 1 : Calcul\n\nx";
    const outline = extractOutline(md);
    expect(outline.map((o) => o.text)).toEqual(["Premier titre", "Exercice 1 : Calcul"]);
    const out = await html(md);
    for (const item of outline) expect(out).toContain(`id="${item.id}"`);
  });
});

describe("durée de lecture", () => {
  it("compte la prose et le code", async () => {
    const { readingMinutes } = await import("@/lib/markdown/outline");
    expect(readingMinutes("mot ".repeat(400))).toBe(2);
    expect(readingMinutes("```python\n" + "x = 1\n".repeat(400) + "```")).toBeGreaterThanOrEqual(1);
    expect(readingMinutes("mot ".repeat(200) + "\n```python\n" + "print('bonjour')\n".repeat(150) + "```")).toBeGreaterThan(1);
  });
});

describe("rendu des sketchnotes", () => {
  it("rend une sketchnote dessinée avec ses bulles, son piège et sa phrase à retenir", async () => {
    const md = "```sketchnote\ntitle: Titre test\ncenter: L'idée centrale du chapitre test\npoints:\n" +
      "  - icon: brain\n    title: Point A\n    text: Explication du point A.\n".repeat(1) +
      "  - icon: code\n    title: Point B\n    text: Explication du point B.\n" +
      "  - icon: target\n    title: Point C\n    text: Explication du point C.\n" +
      "  - icon: rocket\n    title: Point D\n    text: Explication du point D.\n" +
      "pitfall: Le piège classique à éviter\nremember: La phrase essentielle à retenir\n```";
    const out = await html(md);
    expect(out).toContain('class="sketchnote');
    expect(out).toContain("Titre test");
    expect(out).toContain("Point D");
    expect(out).toContain("Piège à éviter");
    expect(out).toContain("La phrase essentielle à retenir");
    expect(out).toContain("sketch-wobble");
    expect(out).not.toContain("Sketchnote invalide");
  });
});
