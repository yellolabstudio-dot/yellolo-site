import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GalleryContent } from "./gallery-content";

export const metadata = { title: "Галерея — Yellolab Studio" };

export default function GalleryPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><GalleryContent /></main>
      <SiteFooter />
    </div>
  );
}
