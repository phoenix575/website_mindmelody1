import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */

export function Section({
  children,
  className,
  ...rest
}: ComponentProps<"section">) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...rest}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
      <span aria-hidden="true" className="h-px w-6 bg-brand/60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center [&_p:first-child]:justify-center",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand px-5 py-2.5 text-brand-fg shadow-sm hover:brightness-110 hover:shadow-md",
  secondary:
    "border border-border-strong bg-surface px-5 py-2.5 text-fg hover:border-brand hover:text-brand",
  ghost: "px-3 py-2 text-muted hover:text-fg",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
} & Omit<ComponentProps<typeof Link>, "href">) {
  const external = href.startsWith("http");
  const classes = cn(BUTTON_BASE, BUTTON_VARIANTS[variant], className);

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "accent" | "warm" | "muted";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-soft text-brand",
    accent: "bg-accent-soft text-accent",
    warm: "bg-warm-soft text-warm",
    muted: "bg-surface-2 text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-muted [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-fg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="mt-1 h-4 w-4 shrink-0 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10.5 8 14.5 16 5.5" />
      </svg>
      <span className="text-muted">{children}</span>
    </li>
  );
}
