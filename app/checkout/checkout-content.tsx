"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, ShoppingBag, Loader2, CheckCircle, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";

export function CheckoutContent() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if ((items?.length ?? 0) === 0 && !success) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 text-center py-20">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
        <h1 className="font-display text-3xl font-bold mb-4">Корзина пуста</h1>
        <Link href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 text-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-[#4C763B]" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold mb-4">Заказ оформлен!</h1>
        <p className="text-muted-foreground mb-8">Мы свяжемся с вами для подтверждения оплаты</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold">
          На главную
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Укажите имя и email");
      return;
    }
    setSending(true);
    try {
      const orderItems = (items ?? []).map((i: any) => ({ productId: i?.id, quantity: i?.quantity ?? 1 }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: orderItems }),
      });
      if (res.ok) {
        clearCart();
        setSuccess(true);
      } else {
        const data = await res.json();
        toast.error(data?.error ?? "Ошибка оформления");
      }
    } catch {
      toast.error("Ошибка сети");
    }
    setSending(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8">Оформление <span className="text-[#FFFD8F]">заказа</span></h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8 space-y-5">
            <h2 className="font-display text-xl font-bold mb-2">Контактные данные</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Имя *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Ваше имя" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="+380 ..." />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Адрес доставки</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Адрес" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Комментарий</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors resize-none" placeholder="Дополнительная информация" />
              </div>
            </div>

            <div className="border-t border-border/50 pt-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FFFD8F]" />
                Оплата
              </h2>
              <div className="rounded-xl bg-[#FFFD8F]/5 border border-[#FFFD8F]/20 p-4">
                <p className="text-sm text-muted-foreground">Оплата через Stripe будет доступна в ближайшее время. После оформления заказа мы свяжемся с вами для уточнения деталей оплаты.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-card border border-border/50 p-6">
            <h2 className="font-display text-xl font-bold mb-4">Ваш заказ</h2>
            <div className="space-y-3 mb-6">
              {(items ?? []).map((item: any) => (
                <div key={item?.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{item?.name ?? ''} x{item?.quantity ?? 1}</span>
                  <span className="font-mono">${((item?.price ?? 0) * (item?.quantity ?? 1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border/50 pt-3 flex justify-between">
                <span className="font-bold">Итого</span>
                <span className="font-display text-2xl font-bold text-[#FFFD8F]">${totalPrice?.toFixed?.(2) ?? '0.00'}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              Подтвердить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
