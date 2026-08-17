import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIContent } from "./ai-content";

export const metadata = { title: "AI сервисы — Yellolab Studio" };

export default function AIPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><AIContent /></main>
      <SiteFooter />
    </div>
  );
}
