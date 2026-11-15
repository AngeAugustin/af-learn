"use client";

import { useEffect, useState } from "react";
import type { OutlineItem } from "@/lib/markdown/outline";

/** Sommaire « Dans cette section » avec mise en évidence du titre en cours de lecture. */
export function SectionOutline({ items }: { items: OutlineItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  return (
    <div className="card p-4">
      <p className="label-mono text-fg-subtle">Dans cette section</p>
      <nav className="mt-3 space-y-2 text-[13px]" aria-label="Sommaire de la section">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block leading-snug transition-colors ${
              active === item.id ? "border-l-2 border-brand pl-2.5 font-medium text-fg" : "pl-3 text-fg-muted hover:text-fg"
            }`}
          >
            {i + 1}. {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
