import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartContent } from "./cart-content";

export const metadata = { title: "Корзина — Yellolab Studio" };

export default function CartPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><CartContent /></main>
      <SiteFooter />
    </div>
  );
}
