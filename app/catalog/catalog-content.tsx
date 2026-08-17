"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Check, Layers, Play, Video, Clapperboard, Type, Monitor, Filter } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  imageUrl: string;
}

const subcategories = [
  { key: "all", label: "Все", icon: Filter },
  { key: "graphic-pack", label: "Graphic Pack", icon: Layers },
  { key: "transition", label: "Transition", icon: Play },
  { key: "reels", label: "Reels", icon: Video },
  { key: "intro-opener", label: "Intro & Opener", icon: Clapperboard },
  { key: "titles", label: "Titles", icon: Type },
  { key: "mockup", label: "Mock-Up", icon: Monitor },
];

export function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/products?category=editing")
      .then((r) => r.json())
      .then((d) => setProducts(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? products : (products ?? []).filter((p: Product) => p?.subcategory === filter);

  const handleAdd = (p: Product) => {
    addItem({ id: p?.id, name: p?.name, price: p?.price, imageUrl: p?.imageUrl });
    setAddedIds((prev) => new Set(prev).add(p?.id));
    toast.success(`${p?.name ?? 'Товар'} добавлен в корзину`);
    setTimeout(() => setAddedIds((prev) => {
      const next = new Set(prev);
      next.delete(p?.id);
      return next;
    }), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Для <span className="text-[#FFFD8F]">монтажа</span></h1>
        <p className="text-muted-foreground text-lg">Профессиональные ресурсы для видеомонтажа и постпродакшна</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {subcategories.map((sub) => (
          <button
            key={sub.key}
            onClick={() => setFilter(sub.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === sub.key
                ? "bg-[#FFFD8F] text-[#043915]"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#FFFD8F]/30"
            }`}
          >
            <sub.icon className="w-4 h-4" />
            {sub.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (filtered?.length ?? 0) === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Товары скоро появятся</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {(filtered ?? []).map((product: Product, i: number) => (
              <motion.div
                key={product?.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-[#FFFD8F]/30 transition-all"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <Image
                    src={product?.imageUrl ?? ''}
                    alt={product?.name ?? 'Товар'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold mb-1">{product?.name ?? ''}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product?.description ?? ''}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-[#FFFD8F]">${product?.price?.toFixed?.(2) ?? '0.00'}</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        addedIds.has(product?.id)
                          ? "bg-[#4C763B] text-white"
                          : "bg-[#FFFD8F] text-[#043915] hover:bg-[#FFFD8F]/80"
                      }`}
                    >
                      {addedIds.has(product?.id) ? (
                        <><Check className="w-4 h-4" /> Добавлено</>
                      ) : (
                        <><ShoppingCart className="w-4 h-4" /> В корзину</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
