"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  label,
  language = "sh",
}: {
  code: string;
  label?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can be blocked; the code is still selectable */
    }
  }

  return (
    <figure className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-border bg-surface-2">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="font-mono text-xs text-subtle">
          {label ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand"
        >
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> code snippet to clipboard</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono text-fg">{code}</code>
      </pre>
    </figure>
  );
}
