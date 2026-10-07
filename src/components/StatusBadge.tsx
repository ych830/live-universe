import { STATUS_LABEL, type Status } from "@/lib/status";

const STYLE: Record<Status, string> = {
  onsale: "bg-text text-paper",
  opensoon: "bg-brand text-brand-ink",
  upcoming: "border border-text bg-paper text-text",
  past: "bg-soft text-sub",
};

export function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-semibold tracking-[0.1em] ${STYLE[status]} ${
        size === "md" ? "px-3 py-1.5 text-[11px]" : "px-2 py-1 text-[9.5px]"
      }`}
    >
      {status === "onsale" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />}
      {STATUS_LABEL[status].en}
    </span>
  );
}
