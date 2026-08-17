import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeContent } from "@/components/home-content";

export default function HomePage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <HomeContent />
      <SiteFooter />
    </div>
  );
}
