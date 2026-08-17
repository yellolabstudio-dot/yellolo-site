"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Film, FolderOpen, Sparkles, Image as ImageIcon, Play, Layers, Type, Monitor, Clapperboard, Video, BookOpen, Users, Zap, Wand2 } from "lucide-react";

const categories = [
  {
    title: "Для монтажа",
    description: "Графические пакеты, переходы, шаблоны и мокапы",
    icon: FolderOpen,
    href: "/catalog",
    color: "#FFFD8F",
  },
  {
    title: "Создать",
    description: "Профессиональное видеопроизводство под ключ",
    icon: Film,
    href: "/services",
    color: "#B0CE88",
  },
  {
    title: "AI",
    description: "Искусственный интеллект для создания контента",
    icon: Sparkles,
    href: "/ai",
    color: "#4C763B",
  },
  {
    title: "Галерея",
    description: "Портфолио наших лучших работ",
    icon: ImageIcon,
    href: "/gallery",
    color: "#FFFD8F",
  },
];

const productHighlights = [
  { name: "Graphic Pack", icon: Layers, img: "https://cdn.abacus.ai/images/8a0bde76-f10d-46a0-81af-5e8fc2dd18f2.png" },
  { name: "Transitions", icon: Play, img: "https://cdn.abacus.ai/images/5c3fe040-505a-4c15-a3c6-a7c21d3aa9e0.png" },
  { name: "Reels", icon: Video, img: "https://cdn.abacus.ai/images/11345224-6072-41cc-b287-9e3daf22e9e2.png" },
  { name: "Titles", icon: Type, img: "https://cdn.abacus.ai/images/36ba8cc5-5aba-4cf0-a202-2ddbf2254227.png" },
];

function Counter({ end, label }: { end: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#FFFD8F]">{count}+</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function HomeContent() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://cdn.abacus.ai/images/802aab0b-ca69-4f3a-a273-dd97a018d433.png"
            alt="Студия видеопроизводства Yellolab"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFD8F]/10 border border-[#FFFD8F]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#FFFD8F]" />
              <span className="text-sm font-medium text-[#FFFD8F]">Студия видеопроизводства</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#FFFD8F]">Yellolab</span> Studio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Профессиональные материалы для монтажа видео и создание контента любой сложности.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all shadow-lg shadow-[#FFFD8F]/20"
              >
                <Film className="w-5 h-5" />
                Заказать видео
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#4C763B] text-[#B0CE88] font-semibold hover:bg-[#4C763B]/20 transition-all"
              >
                <FolderOpen className="w-5 h-5" />
                Каталог материалов
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/30">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter end={500} label="Готовых шаблонов" />
          <Counter end={150} label="Выполненных проектов" />
          <Counter end={80} label="Довольных клиентов" />
          <Counter end={5} label="Лет опыта" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Наши направления</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Всё для создания профессионального видеоконтента</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={cat.href}
                  className="group block p-6 rounded-2xl bg-card border border-border/50 hover:border-transparent transition-all duration-300"
                  style={{ boxShadow: `0 0 0 0 ${cat.color}00` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${cat.color}15` }}>
                    <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-[#FFFD8F] transition-colors">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium" style={{ color: cat.color }}>
                    Подробнее <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-20 bg-card/50">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Популярные материалы</h2>
            <p className="text-muted-foreground">Премиальные ресурсы для ваших проектов</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productHighlights.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/catalog" className="group block rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-[#FFFD8F]/30 transition-all">
                  <div className="relative aspect-video bg-muted">
                    <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#FFFD8F]" />
                    <span className="font-semibold">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all">
              Смотреть все <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#043915] via-[#4C763B]/50 to-[#043915]" />
            <div className="relative z-10">
              <Clapperboard className="w-12 h-12 text-[#FFFD8F] mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Готовы начать проект?</h2>
              <p className="text-white/70 max-w-lg mx-auto mb-8">
                Свяжитесь с нами для обсуждения вашего проекта или выберите готовые решения из нашего каталога
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contacts" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-white transition-all">
                  Связаться
                </Link>
                <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
                  Наши услуги
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}