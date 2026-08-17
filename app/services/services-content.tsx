"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Video, MonitorPlay, Megaphone, BookOpen, FileVideo, Users, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const services = [
  { key: "reels", title: "Reels (Instagram, TikTok)", desc: "Короткие вертикальные видео для социальных сетей с динамичным монтажом и эффектами", price: "от $50", img: "/services/reels.jpg", icon: Film },
  { key: "youtube", title: "Видео для Youtube", desc: "Полноценные видео для YouTube канала с профессиональным монтажом, цветокоррекцией и графикой", price: "от $150", img: "/services/youtube.jpg", icon: MonitorPlay },
  { key: "facebook", title: "Видео для Facebook", desc: "Оптимизированные видео для Facebook с учётом особенностей платформы", price: "от $100", img: "/services/facebook.jpg", icon: Video },
  { key: "commercial", title: "Рекламное видео", desc: "Профессиональные рекламные ролики для продвижения продуктов и услуг", price: "от $300", img: "/services/commercial.jpg", icon: Megaphone },
  { key: "tutorial", title: "Учебное пособие", desc: "Обучающие видео, курсы и туториалы с понятной структурой", price: "от $200", img: "/services/tutorial.jpg", icon: BookOpen },
  { key: "documentary", title: "Документальное видео", desc: "Документальные фильмы и репортажи с профессиональной съёмкой и монтажом", price: "от $500", img: "/services/documentary.jpg", icon: FileVideo },
];

export function ServicesContent() {
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", description: "", budget: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.description || !selected) {
      toast.error("Заполните все обязательные поля");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, serviceType: selected }),
      });
      if (res.ok) {
        toast.success("Заявка отправлена! Мы свяжемся с вами.");
        setForm({ name: "", email: "", phone: "", description: "", budget: "" });
        setSelected(null);
      } else {
        toast.error("Ошибка отправки");
      }
    } catch { 
      toast.error("Ошибка сети"); 
    }
    setSending(false);
  };

  const selectedServiceObj = services.find(s => s.key === selected);

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Создать <span className="text-[#FFFD8F]">видео</span></h1>
        <p className="text-muted-foreground text-lg">Профессиональное видеопроизводство под ключ. Выберите тип видео и оставьте заявку</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((s) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 * 0.05 }}
            onClick={() => setSelected(selected === s.key ? null : s.key)}
            className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${
              selected === s.key ? "border-[#80CE88] bg-[#80CE88]/5" : "border-border/50 bg-card hover:border-[#80CE88]/50"
            }`}
          >
            <div className="relative aspect-video bg-muted overflow-hidden">
              <Image src={s.img} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#80CE88]/20 flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-[#80CE88]" />
                </div>
                <span className="font-mono text-sm font-bold text-[#FFFD8F]">{s.price}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && selectedServiceObj && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-card border border-[#80CE88]/30 p-6 md:p-8 relative mb-12 shadow-2xl"
          >
            <button 
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-2xl font-bold mb-2">
              Оставить заявку на: <span className="text-[#FFFD8F]">{selectedServiceObj.title}</span>
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">Заполните форму ниже, и мы свяжемся с вами для обсуждения деталей.</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Ваше имя *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Иван"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#80CE88]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#80CE88]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Телефон / Telegram</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+380..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#80CE88]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Бюджет (необязательно)</label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="Например: $100"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#80CE88]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Описание задачи / пожелания *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Расскажите немного о вашем проекте..."
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#80CE88] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#FFFD8F] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Отправить заявку
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}