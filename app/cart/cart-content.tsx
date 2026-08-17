"use client";

import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";

export function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if ((items?.length ?? 0) === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 text-center py-20">
        <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
        <h1 className="font-display text-3xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-muted-foreground mb-8">Добавьте товары из каталога</p>
        <Link href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all">
          <ShoppingBag className="w-5 h-5" />
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8">Корзина <span className="text-[#FFFD8F]">({totalItems})</span></h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {(items ?? []).map((item: any, i: number) => (
            <motion.div
              key={item?.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <Image src={item?.imageUrl ?? ''} alt={item?.name ?? ''} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item?.name ?? ''}</h3>
                <p className="text-[#FFFD8F] font-mono font-bold mt-1">${item?.price?.toFixed?.(2) ?? '0.00'}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(item?.id, (item?.quantity ?? 1) - 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold w-8 text-center">{item?.quantity ?? 1}</span>
                  <button onClick={() => updateQuantity(item?.id, (item?.quantity ?? 1) + 1)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeItem(item?.id)} className="ml-auto w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-card border border-border/50 p-6">
            <h2 className="font-display text-xl font-bold mb-4">Итого</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товары ({totalItems})</span>
                <span>${totalPrice?.toFixed?.(2) ?? '0.00'}</span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between">
                <span className="font-bold">К оплате</span>
                <span className="font-display text-2xl font-bold text-[#FFFD8F]">${totalPrice?.toFixed?.(2) ?? '0.00'}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all">
              Оформить заказ <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/catalog" className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-3 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-all">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
