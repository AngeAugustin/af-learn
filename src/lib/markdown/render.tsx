import "server-only";
import type { ComponentProps, ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import { ChevronDown, Eye } from "lucide-react";
import { remarkCallouts, remarkDiagrams } from "./plugins";
import { rehypeExerciseCards, rehypeSolutions } from "./rehype-lesson";
import { Callout } from "@/components/content/callout";
import { CodeBlock } from "@/components/content/code-block";
import { Diagram } from "@/components/diagrams/diagram";
import { Sketchnote } from "@/components/content/sketchnote";

const shikiOptions: RehypeShikiOptions = {
  themes: { light: "github-light", dark: "github-dark-dimmed" },
  defaultColor: false,
  langs: [
    "python", "bash", "json", "sql", "javascript", "typescript", "yaml", "dockerfile",
    "html", "css", "jsx", "tsx", "powershell", "nginx", "hcl", "ini", "toml", "diff", "http", "markdown",
  ],
  fallbackLanguage: "text",
  transformers: [
    {
      pre(node) {
        node.properties["data-language"] = this.options.lang;
      },
    },
  ],
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCallouts)
  .use(remarkDiagrams)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeSolutions)
  .use(rehypeExerciseCards)
  .use(rehypeShiki, shikiOptions);

type ElementProps = Record<string, unknown> & { children?: ReactNode; node?: unknown };

const components = {
  "diagram-block": (props: ElementProps) => <Diagram source={String(props["data-spec"] ?? "")} />,
  "sketchnote-block": (props: ElementProps) => <Sketchnote source={String(props["data-spec"] ?? "")} />,
  aside: ({ children, ...rest }: ElementProps) =>
    typeof rest["data-callout"] === "string" ? (
      <Callout type={rest["data-callout"] as string}>{children}</Callout>
    ) : (
      <aside>{children}</aside>
    ),
  pre: (rest: ElementProps) => <CodeBlock {...(rest as ComponentProps<"pre">)} />,
  table: ({ children }: ElementProps) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  summary: ({ children }: ElementProps) => (
    <summary className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-bg-sunken">
      <span className="flex items-center gap-2.5 text-sm font-semibold text-fg">
        <Eye className="size-[18px] shrink-0 text-brand" aria-hidden />
        {children}
      </span>
      <ChevronDown className="solution-chevron size-[18px] shrink-0 text-fg-muted transition-transform duration-200" aria-hidden />
    </summary>
  ),
  h2: ({ children, ...rest }: ElementProps) => {
    const number = rest["data-exercise"];
    if (typeof number !== "string") return <h2 id={rest.id as string | undefined}>{children}</h2>;
    return (
      <div className="not-prose mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-fg">
          {number}
        </span>
        <div className="min-w-0">
          <span className="label-mono text-accent">Exercice {number}</span>
          <h2 id={rest.id as string | undefined} className="mt-0.5 text-lg font-bold leading-snug tracking-tight text-fg sm:text-xl">
            {children}
          </h2>
        </div>
      </div>
    );
  },
  a: ({ href, children }: ElementProps) => {
    const url = String(href ?? "");
    const external = /^https?:\/\//.test(url);
    return (
      <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

const cacheByBody = new Map<string, Promise<ReactNode>>();

async function compile(markdown: string): Promise<ReactNode> {
  const mdast = processor.parse(markdown);
  const hast = (await processor.run(mdast)) as Root;
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: components as never,
    passNode: false,
  });
}

/** Rend du Markdown du cours en éléments React (côté serveur), avec un cache en mémoire. */
export function renderMarkdown(markdown: string): Promise<ReactNode> {
  let result = cacheByBody.get(markdown);
  if (!result) {
    result = compile(markdown);
    cacheByBody.set(markdown, result);
    result.catch(() => cacheByBody.delete(markdown));
  }
  return result;
}
