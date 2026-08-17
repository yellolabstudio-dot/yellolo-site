import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginContent } from "./login-content";

export const metadata = { title: "Вход — Yellolab Studio" };

export default function LoginPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><LoginContent /></main>
      <SiteFooter />
    </div>
  );
}
