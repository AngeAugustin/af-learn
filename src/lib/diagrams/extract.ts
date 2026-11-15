/** Extrait le contenu des blocs ```diagram d'un texte Markdown. */
export function extractDiagramSources(markdown: string): string[] {
  const sources: string[] = [];
  const regex = /^```diagram[ \t]*\n([\s\S]*?)^```[ \t]*$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) sources.push(match[1]);
  return sources;
}
