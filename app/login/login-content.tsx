"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export function LoginContent() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) { toast.error("Укажите email и пароль"); return; }
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        toast.error("Неверный email или пароль");
      } else {
        router.replace("/");
      }
    } catch { toast.error("Ошибка входа"); }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!form.email || !form.password) { toast.error("Укажите email и пароль"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
        if (!result?.error) {
          router.replace("/");
        }
      } else {
        const data = await res.json();
        toast.error(data?.error ?? "Ошибка регистрации");
      }
    } catch { toast.error("Ошибка сети"); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border/50 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFD8F] flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-2xl text-[#043915]">Y</span>
          </div>
          <h1 className="font-display text-2xl font-bold">{mode === "login" ? "Вход" : "Регистрация"}</h1>
        </div>

        <div className="flex rounded-xl bg-muted p-1 mb-6">
          <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-[#FFFD8F] text-[#043915]" : "text-muted-foreground"}`}>Вход</button>
          <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "signup" ? "bg-[#FFFD8F] text-[#043915]" : "text-muted-foreground"}`}>Регистрация</button>
        </div>

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium mb-1 block">Имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Ваше имя" />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="email@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-[#FFFD8F] focus:outline-none transition-colors" placeholder="Ваш пароль" />
            </div>
          </div>
          <button
            onClick={mode === "login" ? handleLogin : handleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold hover:bg-[#FFFD8F]/90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
