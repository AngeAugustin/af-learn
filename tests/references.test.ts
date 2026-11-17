import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, Fragment } from "react";
import { renderMarkdown } from "@/lib/markdown/render";
import { loadAllParcours } from "@/lib/content/loader";
import { extractVideoSources, parseVideo, timeToSeconds, videoWatchUrl, youtubeId } from "@/lib/content/references";

const block = (extra = "") =>
  "```video\nurl: https://www.youtube.com/watch?v=eMlx5fFNoYc\ntitle: Attention in transformers\nchannel: 3Blue1Brown\n" +
  `duration: "26:09"\nlang: en\nwhy: Le calcul de l'attention en animation.\n${extra}\`\`\``;

describe("vidéos recommandées", () => {
  it("reconnaît les formats d'URL YouTube", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=eMlx5fFNoYc")).toBe("eMlx5fFNoYc");
    expect(youtubeId("https://youtu.be/eMlx5fFNoYc?t=30")).toBe("eMlx5fFNoYc");
    expect(youtubeId("https://www.youtube.com/watch?list=x&v=eMlx5fFNoYc")).toBe("eMlx5fFNoYc");
    expect(youtubeId("https://vimeo.com/123")).toBeNull();
    expect(youtubeId("http://www.youtube.com/watch?v=eMlx5fFNoYc")).toBeNull();
  });

  it("démarre le lien au passage conseillé", () => {
    expect(timeToSeconds("1:02:30")).toBe(3750);
    const video = parseVideo(block('from: "3:05"\n').replace(/^```video\n|```$/g, ""));
    expect(videoWatchUrl(video)).toBe("https://www.youtube.com/watch?v=eMlx5fFNoYc&t=185s");
  });

  it("refuse un bloc incomplet ou une clé inconnue", () => {
    expect(() => parseVideo("url: https://www.youtube.com/watch?v=eMlx5fFNoYc\ntitle: X")).toThrow();
    expect(() => parseVideo(block("auteur: moi\n").replace(/^```video\n|```$/g, ""))).toThrow();
  });

  it("rend une carte qui ouvre YouTube dans un nouvel onglet, sans rien charger de YouTube", async () => {
    const out = renderToStaticMarkup(createElement(Fragment, null, await renderMarkdown(block())));
    expect(out).toContain('href="https://www.youtube.com/watch?v=eMlx5fFNoYc"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain("Pour aller plus loin en vidéo");
    expect(out).toContain("en anglais, sous-titres disponibles");
    expect(out).not.toMatch(/<(img|iframe)/);
  });
});

describe("sources et vidéos du contenu", () => {
  const all = loadAllParcours();

  it("donne à chaque parcours publié une photo de couverture présente dans public/", () => {
    for (const p of all.filter((x) => x.status === "published")) {
      expect(p.cover, p.slug).not.toBeNull();
      expect(existsSync(join(process.cwd(), "public", p.cover!.src)), p.cover!.src).toBe(true);
    }
  });

  it("ne cite chaque source qu'une fois par parcours", () => {
    for (const p of all) expect(new Set(p.sources.map((s) => s.url)).size, p.slug).toBe(p.sources.length);
  });

  it("n'utilise que des blocs vidéo valides", () => {
    let total = 0;
    for (const p of all)
      for (const m of p.modules)
        for (const c of m.chapters)
          for (const s of c.sections)
            for (const v of extractVideoSources(s.body)) {
              total++;
              expect(() => parseVideo(v), `${c.slug}/${s.slug}`).not.toThrow();
            }
    expect(total).toBeGreaterThan(0);
  });
});
