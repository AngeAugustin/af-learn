import { loadAllParcours } from "../src/lib/content/loader";
import { extractDiagramSources } from "../src/lib/diagrams/extract";
import { parseDiagram } from "../src/lib/diagrams/spec";
import { extractSketchnoteSources, parseSketchnote } from "../src/lib/sketchnote";
import { findEmDashes } from "./typography";

/** Vérifie l'ensemble du contenu (structure, évaluations, diagrammes) et affiche un bilan. */
function main() {
  const all = loadAllParcours();
  let errors = 0;
  for (const p of all) {
    const chapters = p.modules.flatMap((m) => m.chapters);
    let diagrams = 0;
    let sketchnotes = 0;
    for (const m of p.modules) {
      for (const c of m.chapters) {
        for (const s of c.sections) {
          for (const source of extractSketchnoteSources(s.body)) {
            sketchnotes++;
            try {
              parseSketchnote(source);
            } catch (error) {
              errors++;
              console.error(`✗ ${m.slug}/${c.slug} › ${s.slug} : sketchnote invalide\n  ${(error as Error).message}`);
            }
          }
          for (const source of extractDiagramSources(s.body)) {
            diagrams++;
            try {
              parseDiagram(source);
            } catch (error) {
              errors++;
              console.error(`✗ ${m.slug}/${c.slug} › ${s.slug} : diagramme invalide\n  ${(error as Error).message}`);
            }
          }
        }
      }
    }
    const minutes = chapters.reduce((n, c) => n + c.duration, 0);
    console.log(
      `✓ ${p.title} (${p.status}) : ${p.modules.length} modules, ${chapters.length} chapitres, ` +
        `${chapters.reduce((n, c) => n + c.sections.length, 0)} sections, ` +
        `${chapters.reduce((n, c) => n + c.questions.length, 0)} questions, ${diagrams} diagrammes, ${sketchnotes} sketchnotes, ` +
        `≈ ${Math.round(minutes / 60)} h`,
    );
  }
  const dashes = findEmDashes();
  for (const hit of dashes) console.error(`✗ ${hit} : tiret cadratin interdit (utiliser « : », « , », des parenthèses ou « · »)`);
  errors += dashes.length;
  if (errors > 0) {
    console.error(`${errors} erreur(s) de contenu.`);
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(`✗ ${(error as Error).message}`);
  process.exit(1);
}
