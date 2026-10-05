import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpaceBackground />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
