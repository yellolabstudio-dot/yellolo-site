import Link from "next/link";
import { Mail, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFFD8F] flex items-center justify-center">
              <span className="font-display font-bold text-lg text-[#043915]">Y</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Yellolab Studio
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/catalog" className="hover:text-foreground transition-colors">Каталог</Link>
            <Link href="/gallery" className="hover:text-foreground transition-colors">Галерея</Link>
            <Link href="/contacts" className="hover:text-foreground transition-colors">Контакты</Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:yellolabstudio@gmail.com" className="flex items-center gap-1.5 hover:text-[#FFFD8F] transition-colors">
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a href="https://t.me/Yellolab" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#FFFD8F] transition-colors">
              <Send className="w-4 h-4" />
              Telegram
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Yellolab Studio. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
