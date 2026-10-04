import { vendorName } from "@/lib/vendors";
import type { TicketLink } from "@/lib/types";

export function TicketButtons({ links, size = "md" }: { links: TicketLink[]; size?: "sm" | "md" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l, i) => (
        <a
          key={`${l.vendor}-${i}`}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-2 rounded-full font-semibold transition-colors ${
            i === 0 ? "bg-fg text-ink hover:bg-pink hover:text-white" : "border border-fg/30 hover:border-fg"
          } ${size === "md" ? "px-5 py-3 text-sm" : "px-4 py-2 text-[13px]"}`}
        >
          {vendorName(l.vendor, l.label)} 예매
          <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </a>
      ))}
    </div>
  );
}
