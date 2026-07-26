import { FAQS } from "@/lib/content";

/**
 * Native <details> — keyboard operable and announced correctly without any
 * JavaScript, which keeps this section useful even if hydration never runs.
 */
export function FaqList() {
  return (
    <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {FAQS.map((faq) => (
        <details key={faq.question} className="group px-6 py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5 shrink-0 text-subtle transition-transform duration-200 group-open:rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M10 4v12M4 10h12" />
            </svg>
          </summary>
          <p className="pb-5 pr-8 leading-relaxed text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
