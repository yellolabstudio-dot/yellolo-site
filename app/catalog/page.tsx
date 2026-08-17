import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogContent } from "./catalog-content";

export const metadata = { title: "Для монтажа — Yellolab Studio" };

export default function CatalogPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16">
        <CatalogContent />
      </main>
      <SiteFooter />
    </div>
  );
}
