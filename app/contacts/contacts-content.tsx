"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, Clock, Loader2, CheckCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function ContactsContent() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Заполните все обязательные поля");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.success("Сообщение успешно отправлено в Telegram!");
      } else {
        toast.error("Ошибка отправки");
      }
    } catch { toast.error("Ошибка сети"); }
    setSending(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Контакты</h1>
        <p className="text-muted-foreground text-lg">Свяжитесь с нами для обсуждения проекта</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-card border border-border/50 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFFD8F]/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-[#FFFD8F]" />
          </div>
          <h3 className="font-bold mb-2">Email</h3>
          <a href="mailto:yellolabstudio@gmail.com" className="text-sm text-[#FFFD8F] hover:underline">yellolabstudio@gmail.com</a>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-card border border-border/50 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#4C763B]/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-[#4C763B]" />
          </div>
          <h3 className="font-bold mb-2">Telegram</h3>
          <a href="https://t.me/Yellolab" target="_blank" rel="noopener noreferrer" className="text-sm text-[#4C763B] hover:underline">@Yellolab</a>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-card border border-border/50 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#B0CE88]/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-[#B0CE88]" />
          </div>
          <h3 className="font-bold mb-2">Рабочие часы</h3>
          <p className="text-sm text-muted-foreground">Пн–Пт: 9:00 – 18:00</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
        <div className="rounded-2xl bg-card border border-border/50 p-8">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FFFD8F]" />
            Напишите нам
          </h2>
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#4C763B]" />
              <h3 className="font-display text-xl font-bold mb-2">Сообщение отправлено!</h3>
              <p className="text-muted-foreground mb-4">Мы ответим в ближайшее время</p>
              <button onClick={() => setSent(false)} className="text-sm text-[#FFFD8F] hover:underline">Отправить ещё</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Имя *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Тема</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Тема сообщения" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Сообщение *</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors resize-none" placeholder="Ваше сообщение..." />
              </div>
              <button onClick={handleSubmit} disabled={sending} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all disabled:opacity-50">
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Отправить
              </button>
              <p className="text-xs text-muted-foreground text-center">Ваши данные будут использованы только для связи с вами</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}