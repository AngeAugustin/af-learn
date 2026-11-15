"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";

const LABELS: Record<string, string> = {
  python: "python",
  bash: "terminal",
  json: "json",
  sql: "sql",
  javascript: "javascript",
  typescript: "typescript",
  yaml: "yaml",
  dockerfile: "dockerfile",
  html: "html",
  css: "css",
  jsx: "jsx",
  tsx: "tsx",
  powershell: "powershell",
  nginx: "nginx",
  hcl: "terraform",
  ini: "ini",
  toml: "toml",
  diff: "diff",
  http: "http",
  markdown: "markdown",
  text: "texte",
};

/** Bloc de code sombre avec en-tête (langage) et bouton de copie. */
export function CodeBlock(props: ComponentProps<"pre"> & { "data-language"?: string }) {
  const { "data-language": language, className, children, ...rest } = props;
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : on ignore silencieusement
    }
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] text-[var(--code-fg)] shadow-pop">
      <div className="flex h-10 items-center justify-between border-b border-[var(--code-border)] bg-[var(--code-header)] px-4">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ef4444]" />
          <span className="size-2.5 rounded-full bg-[#fbbf24]" />
          <span className="size-2.5 rounded-full bg-[#34d399]" />
          <span className="ml-2 font-mono text-[11px] font-medium text-[#8f9a8b]">{LABELS[language ?? ""] ?? language ?? "code"}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#f0b9bf] transition hover:bg-[#22301f]"
          aria-label="Copier le code"
        >
          {copied ? <Check className="size-3.5 text-[#34d399]" /> : <Copy className="size-3.5" />}
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      <pre
        ref={ref}
        {...rest}
        className={`${className ?? ""} overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.65]`}
      >
        {children}
      </pre>
    </div>
  );
}
