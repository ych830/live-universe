import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg/30 focus:border-violet";

export const btn = {
  primary: "rounded-lg bg-fg px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-pink hover:text-white disabled:opacity-50",
  ghost: "rounded-lg border border-line px-4 py-2.5 text-sm transition-colors hover:border-fg/40 disabled:opacity-50",
  danger: "rounded-lg border border-pink/40 px-3 py-2 text-sm text-pink transition-colors hover:bg-pink hover:text-white",
};

export function Field({ label, hint, required, children, className = "" }: { label: string; hint?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-fg/80">
        {label}
        {required && <span className="ml-0.5 text-pink">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-panel/60 p-5 md:p-6">
      <h3 className="mb-5 font-display text-[11px] tracking-[0.16em] text-muted">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
