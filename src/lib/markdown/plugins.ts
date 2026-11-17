import type { Blockquote, Code, Paragraph, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

export const CALLOUT_TYPES = ["note", "tip", "important", "warning", "caution"] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];

/**
 * Convertit les encadrés au format GitHub (`> [!TIP]`) en éléments <aside data-callout="tip">.
 */
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0];
      if (!first || first.type !== "paragraph") return;
      const text = (first as Paragraph).children[0];
      if (!text || text.type !== "text") return;
      const match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/i.exec((text as Text).value);
      if (!match) return;
      (text as Text).value = (text as Text).value.slice(match[0].length);
      if ((text as Text).value === "") (first as Paragraph).children.shift();
      if ((first as Paragraph).children.length === 0) node.children.shift();
      node.data = {
        ...node.data,
        hName: "aside",
        hProperties: { "data-callout": match[1].toLowerCase() },
      };
    });
  };
}

const BLOCK_LANGS = new Set(["diagram", "sketchnote", "video"]);

/**
 * Remplace les blocs ```diagram, ```sketchnote et ```video par un élément <diagram-block>, <sketchnote-block> ou <video-block data-spec="…">
 * rendu par un composant React.
 */
export function remarkDiagrams() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (!BLOCK_LANGS.has(node.lang ?? "") || !parent || index === undefined) return;
      parent.children[index] = {
        type: "paragraph",
        children: [],
        data: { hName: `${node.lang}-block`, hProperties: { "data-spec": node.value } },
      } as Paragraph;
    });
  };
}
