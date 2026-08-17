import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutContent } from "./checkout-content";

export const metadata = { title: "Оформление заказа — Yellolab Studio" };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen graphite-texture">
      <SiteHeader />
      <main className="pt-24 pb-16"><CheckoutContent /></main>
      <SiteFooter />
    </div>
  );
}
