import { STATUS_LABEL, type Status } from "@/lib/status";

const STYLE: Record<Status, string> = {
  onsale: "bg-white text-cobalt",
  opensoon: "bg-black text-white",
  upcoming: "border border-white/70 bg-black/30 text-white backdrop-blur",
  past: "bg-black/50 text-white/80 backdrop-blur",
};

export function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-semibold tracking-[0.1em] ${STYLE[status]} ${
        size === "md" ? "px-3 py-1.5 text-[11px]" : "px-2 py-1 text-[10px]"
      }`}
    >
      {status === "onsale" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cobalt" />}
      {STATUS_LABEL[status].en}
    </span>
  );
}
