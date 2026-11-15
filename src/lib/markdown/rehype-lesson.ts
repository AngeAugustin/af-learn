import type { Element, ElementContent, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";

function isElement(node: RootContent | ElementContent, tag?: string): node is Element {
  return node.type === "element" && (tag === undefined || node.tagName === tag);
}

/**
 * Prépare les solutions repliables : <details class="solution"> dont le contenu (hors <summary>)
 * est regroupé dans un conteneur stylable.
 */
export function rehypeSolutions() {
  return (tree: Root) => {
    const visit = (nodes: (RootContent | ElementContent)[]) => {
      for (const node of nodes) {
        if (!isElement(node)) continue;
        if (node.tagName === "details") {
          const summary = node.children.find((c) => isElement(c, "summary"));
          const body = node.children.filter((c) => c !== summary);
          node.properties = { ...node.properties, className: ["solution"] };
          node.children = [
            ...(summary ? [summary] : []),
            { type: "element", tagName: "div", properties: { className: ["solution-body"] }, children: body },
          ];
        }
        visit(node.children);
      }
    };
    visit(tree.children);
  };
}

// Séparateur « : » (convention), « - » ou, par tolérance, tiret demi-cadratin / cadratin
const EXERCISE_TITLE = /^Exercice\s+(\d+)\s*[\u2014\u2013:-]\s*(.+)$/;

/**
 * Regroupe chaque « ## Exercice N : Titre » et le contenu qui le suit dans une carte d'exercice
 * numérotée (<section class="exercise-card">).
 */
export function rehypeExerciseCards() {
  return (tree: Root) => {
    const out: RootContent[] = [];
    let card: Element | null = null;
    for (const node of tree.children) {
      if (isElement(node, "h2")) {
        const match = EXERCISE_TITLE.exec(toString(node).trim());
        if (match) {
          card = {
            type: "element",
            tagName: "section",
            properties: { className: ["exercise-card"], "data-exercise": match[1] },
            children: [
              {
                type: "element",
                tagName: "h2",
                properties: { ...node.properties, "data-exercise": match[1] },
                children: [{ type: "text", value: match[2] }],
              },
            ],
          };
          out.push(card);
          continue;
        }
        card = null;
      }
      if (card) card.children.push(node as ElementContent);
      else out.push(node);
    }
    tree.children = out;
  };
}
