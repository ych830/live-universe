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
          className={`group relative z-10 inline-flex items-center gap-2 font-display font-semibold transition-colors ${
            i === 0 ? "bg-white text-space hover:bg-cobalt hover:text-white" : "border border-white/60 text-white hover:border-white hover:bg-white/10"
          } ${size === "md" ? "px-5 py-3 text-sm" : "px-3.5 py-2 text-[12px]"}`}
        >
          {vendorName(l.vendor, l.label)} 예매
          <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </a>
      ))}
    </div>
  );
}
