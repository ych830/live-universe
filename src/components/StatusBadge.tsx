import { STATUS_LABEL, type Status } from "@/lib/status";

const STYLE: Record<Status, string> = {
  onsale: "bg-pink text-white",
  opensoon: "bg-lime text-ink",
  upcoming: "border border-fg/40 bg-ink/85 text-fg backdrop-blur",
  past: "bg-ink/85 text-fg/70 backdrop-blur",
};

export function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-display tracking-[0.12em] ${STYLE[status]} ${
        size === "md" ? "px-3.5 py-1.5 text-[11px]" : "px-2.5 py-1 text-[9.5px]"
      }`}
    >
      {status === "onsale" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
      {STATUS_LABEL[status].en}
    </span>
  );
}
