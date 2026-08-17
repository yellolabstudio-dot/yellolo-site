import { SiteHeader } from "@/components/site-header";
import { AdminContent } from "./admin-content";

export const metadata = { title: "Админ-панель — Yellolab Studio" };

export default function AdminPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><AdminContent /></main>
    </div>
  );
}
