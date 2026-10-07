import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "관리자", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="min-h-dvh bg-ink text-fg">
      <AdminApp source={process.env.CONTENT_SOURCE === "supabase" ? "supabase" : "files"} />
    </div>
  );
}
