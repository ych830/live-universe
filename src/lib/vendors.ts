export const VENDORS = [
  { id: "nol", name: "NOL 티켓" },
  { id: "yes24", name: "YES24 티켓" },
  { id: "melon", name: "멜론티켓" },
  { id: "ticketlink", name: "티켓링크" },
  { id: "etc", name: "기타" },
] as const;

export function vendorName(vendor: string, label?: string): string {
  if (label) return label;
  return VENDORS.find((v) => v.id === vendor)?.name ?? vendor;
}
