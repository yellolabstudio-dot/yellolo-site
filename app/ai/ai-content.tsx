"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Brain, Zap, ArrowRight, MessageSquare } from "lucide-react";

const aiServices = [
  {
    key: "creative",
    title: "AI Creative",
    description: "Создание уникального визуального контента с помощью искусственного интеллекта. Генерация изображений, видеоэффектов, графики и анимаций на основе вашего технического задания.",
    features: ["Генерация изображений", "AI видеоэффекты", "Анимация логотипов", "Креативные концепции"],
    icon: Wand2,
    img: "https://cdn.abacus.ai/images/f5d93b52-1e9b-4345-8122-8d8ba8e1a0a5.png",
    color: "#FFFD8F",
  },
  {
    key: "ugs",
    title: "AI UGS",
    description: "Генерация пользовательского контента (UGC) с помощью AI. Создание реалистичных видеообзоров, отзывов и презентаций продуктов.",
    features: ["AI аватары", "Генерация речи", "Видеообзоры", "Социальный контент"],
    icon: Brain,
    img: "https://cdn.abacus.ai/images/8a0bde76-f10d-46a0-81af-5e8fc2dd18f2.png",
    color: "#4C763B",
  },
];

export function AIContent() {
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C763B]/10 border border-[#4C763B]/20 mb-6">
          <Sparkles className="w-4 h-4 text-[#FFFD8F]" />
          <span className="text-sm font-medium text-[#FFFD8F]">Искусственный интеллект</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">AI-<span className="text-[#4C763B]">сервисы</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Используем последние достижения в области AI для создания уникального контента</p>
      </motion.div>

      <div className="space-y-12">
        {aiServices.map((service, i) => (
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-3xl bg-card border border-border/50 overflow-hidden"
          >
            <div className={`grid md:grid-cols-2 gap-0 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
              <div className="relative aspect-video md:aspect-auto bg-muted">
                <Image src={service.img} alt={service.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 md:block hidden" />
              </div>
              <div className={`p-8 md:p-12 flex flex-col justify-center ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${service.color}15` }}>
                  <service.icon className="w-6 h-6" style={{ color: service.color }} />
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight mb-4">{service.title}</h2>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {(service.features ?? []).map((f: string) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-[#FFFD8F]" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/contacts"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all w-fit"
                  style={{ backgroundColor: service.color, color: '#043915' }}
                >
                  <MessageSquare className="w-5 h-5" />
                  Обсудить проект
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
