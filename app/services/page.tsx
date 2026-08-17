import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServicesContent } from "./services-content";

export const metadata = { title: "Создать видео — Yellolab Studio" };

export default function ServicesPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><ServicesContent /></main>
      <SiteFooter />
    </div>
  );
}
