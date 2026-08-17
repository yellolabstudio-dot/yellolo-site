"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Video, MessageSquare, Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save, FileText } from "lucide-react";
import { toast } from "sonner";

type Tab = "products" | "orders" | "videos" | "messages" | "service-requests";

interface Product { id: string; name: string; description: string; price: number; category: string; subcategory: string; imageUrl: string; active: boolean; }
interface Order { id: string; name: string; email: string; phone: string | null; totalAmount: number; status: string; createdAt: string; items: any[]; }
interface VideoItem { id: string; title: string; description: string | null; youtubeUrl: string | null; thumbnailUrl: string | null; active: boolean; sortOrder: number; }
interface Msg { id: string; name: string; email: string; subject: string | null; message: string; status: string; createdAt: string; }
interface SvcReq { id: string; serviceType: string; name: string; email: string; phone: string | null; description: string; budget: string | null; status: string; createdAt: string; }

const emptyProduct: Omit<Product, "id"> = { name: "", description: "", price: 0, category: "editing", subcategory: "graphic-pack", imageUrl: "", active: true };
const emptyVideo: Omit<VideoItem, "id"> = { title: "", description: "", youtubeUrl: "", thumbnailUrl: "", active: true, sortOrder: 0 };

export function AdminContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [serviceRequests, setServiceRequests] = useState<SvcReq[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editVideo, setEditVideo] = useState<any>(null);

  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || !isAdmin) {
      router.replace("/login");
    }
  }, [session, status, isAdmin, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "products") {
        const r = await fetch("/api/products"); setProducts(await r.json() ?? []);
      } else if (tab === "orders") {
        const r = await fetch("/api/orders"); if (r.ok) setOrders(await r.json() ?? []);
      } else if (tab === "videos") {
        const r = await fetch("/api/videos"); setVideos(await r.json() ?? []);
      } else if (tab === "messages") {
        const r = await fetch("/api/contact-messages"); if (r.ok) setMessages(await r.json() ?? []);
      } else if (tab === "service-requests") {
        const r = await fetch("/api/service-request"); if (r.ok) setServiceRequests(await r.json() ?? []);
      }
    } catch {}
    setLoading(false);
  }, [tab]);

  useEffect(() => { if (isAdmin) loadData(); }, [tab, isAdmin, loadData]);

  const saveProduct = async () => {
    if (!editProduct) return;
    try {
      const isNew = !editProduct.id;
      const url = isNew ? "/api/products" : `/api/products/${editProduct.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editProduct) });
      if (res.ok) { toast.success("Сохранено"); setEditProduct(null); loadData(); }
      else toast.error("Ошибка сохранения");
    } catch { toast.error("Ошибка"); }
  };

  const saveVideo = async () => {
    if (!editVideo) return;
    try {
      const isNew = !editVideo.id;
      const url = isNew ? "/api/videos" : `/api/videos/${editVideo.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editVideo) });
      if (res.ok) { toast.success("Сохранено"); setEditVideo(null); loadData(); }
      else toast.error("Ошибка");
    } catch { toast.error("Ошибка"); }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      loadData();
    } catch {}
  };

  if (status === "loading" || !isAdmin) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "products", label: "Товары", icon: Package },
    { key: "orders", label: "Заказы", icon: ShoppingBag },
    { key: "videos", label: "Видео", icon: Video },
    { key: "messages", label: "Сообщения", icon: MessageSquare },
    { key: "service-requests", label: "Заявки", icon: FileText },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-6">Админ-<span className="text-[#FFFD8F]">панель</span></h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.key ? "bg-[#FFFD8F] text-[#043915]" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}

        {/* Products */}
        {tab === "products" && !loading && (
          <div>
            <button onClick={() => setEditProduct({ ...emptyProduct })} className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold text-sm">
              <Plus className="w-4 h-4" /> Добавить товар
            </button>
            <div className="space-y-3">
              {(products ?? []).map((p: Product) => (
                <div key={p?.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {p?.imageUrl && <img src={p.imageUrl} alt={p?.name ?? ''} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p?.name ?? ''}</div>
                    <div className="text-sm text-muted-foreground">{p?.subcategory ?? ''} • ${p?.price?.toFixed?.(2) ?? '0'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditProduct({ ...p })} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><Edit className="w-4 h-4" /></button>
                    <button onClick={async () => { await fetch(`/api/products/${p?.id}`, { method: "DELETE" }); loadData(); }} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && !loading && (
          <div className="space-y-3">
            {(orders ?? []).map((o: Order) => (
              <div key={o?.id} className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <span className="font-mono text-xs text-muted-foreground">#{o?.id?.slice?.(0, 8) ?? ''}</span>
                  <span className="font-semibold">{o?.name ?? ''}</span>
                  <span className="text-sm text-muted-foreground">{o?.email ?? ''}</span>
                  <span className="font-mono font-bold text-[#FFFD8F]">${o?.totalAmount?.toFixed?.(2) ?? '0'}</span>
                  <select value={o?.status ?? 'pending'} onChange={(e) => updateOrderStatus(o?.id, e.target.value)} className="ml-auto px-3 py-1 rounded-lg bg-muted text-sm border border-border/50">
                    <option value="pending">Ожидает</option>
                    <option value="processing">В работе</option>
                    <option value="completed">Выполнен</option>
                    <option value="cancelled">Отменён</option>
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {(o?.items ?? []).map((item: any) => `${item?.product?.name ?? 'Товар'} x${item?.quantity ?? 1}`).join(", ")}
                </div>
              </div>
            ))}
            {(orders?.length ?? 0) === 0 && <p className="text-center text-muted-foreground py-10">Заказов пока нет</p>}
          </div>
        )}

        {/* Videos */}
        {tab === "videos" && !loading && (
          <div>
            <button onClick={() => setEditVideo({ ...emptyVideo })} className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold text-sm">
              <Plus className="w-4 h-4" /> Добавить видео
            </button>
            <div className="space-y-3">
              {(videos ?? []).map((v: VideoItem) => (
                <div key={v?.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{v?.title ?? ''}</div>
                    <div className="text-sm text-muted-foreground truncate">{v?.youtubeUrl ?? ''}</div>
                  </div>
                  <button onClick={() => setEditVideo({ ...v })} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><Edit className="w-4 h-4" /></button>
                  <button onClick={async () => { await fetch(`/api/videos/${v?.id}`, { method: "DELETE" }); loadData(); }} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {tab === "messages" && !loading && (
          <div className="space-y-3">
            {(messages ?? []).map((m: Msg) => (
              <div key={m?.id} className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{m?.name ?? ''}</span>
                  <span className="text-sm text-muted-foreground">{m?.email ?? ''}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{m?.createdAt ? new Date(m.createdAt).toLocaleDateString('ru-RU', { timeZone: 'UTC' }) : ''}</span>
                </div>
                {m?.subject && <div className="text-sm font-medium mb-1">{m.subject}</div>}
                <p className="text-sm text-muted-foreground">{m?.message ?? ''}</p>
              </div>
            ))}
            {(messages?.length ?? 0) === 0 && <p className="text-center text-muted-foreground py-10">Сообщений нет</p>}
          </div>
        )}

        {/* Service Requests */}
        {tab === "service-requests" && !loading && (
          <div className="space-y-3">
            {(serviceRequests ?? []).map((r: SvcReq) => (
              <div key={r?.id} className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#4C763B]/20 text-[#B0CE88] text-xs font-medium">{r?.serviceType ?? ''}</span>
                  <span className="font-semibold">{r?.name ?? ''}</span>
                  <span className="text-sm text-muted-foreground">{r?.email ?? ''}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{r?.createdAt ? new Date(r.createdAt).toLocaleDateString('ru-RU', { timeZone: 'UTC' }) : ''}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r?.description ?? ''}</p>
                {r?.budget && <p className="text-sm mt-1">Бюджет: <span className="text-[#FFFD8F]">{r.budget}</span></p>}
              </div>
            ))}
            {(serviceRequests?.length ?? 0) === 0 && <p className="text-center text-muted-foreground py-10">Заявок нет</p>}
          </div>
        )}

        {/* Product Edit Modal */}
        {editProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditProduct(null)}>
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border/50 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">{editProduct?.id ? "Редактировать" : "Добавить"} товар</h2>
                <button onClick={() => setEditProduct(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input value={editProduct?.name ?? ''} onChange={(e) => setEditProduct({ ...(editProduct ?? {}), name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="Название" />
                <textarea value={editProduct?.description ?? ''} onChange={(e) => setEditProduct({ ...(editProduct ?? {}), description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm resize-none" placeholder="Описание" />
                <input type="number" value={editProduct?.price ?? 0} onChange={(e) => setEditProduct({ ...(editProduct ?? {}), price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="Цена" />
                <select value={editProduct?.subcategory ?? 'graphic-pack'} onChange={(e) => setEditProduct({ ...(editProduct ?? {}), subcategory: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm">
                  <option value="graphic-pack">Graphic Pack</option>
                  <option value="transition">Transition</option>
                  <option value="reels">Reels</option>
                  <option value="intro-opener">Intro & Opener</option>
                  <option value="titles">Titles</option>
                  <option value="mockup">Mock-Up</option>
                </select>
                <input value={editProduct?.imageUrl ?? ''} onChange={(e) => setEditProduct({ ...(editProduct ?? {}), imageUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="URL изображения" />
                <button onClick={saveProduct} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold text-sm"><Save className="w-4 h-4" /> Сохранить</button>
              </div>
            </div>
          </div>
        )}

        {/* Video Edit Modal */}
        {editVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditVideo(null)}>
            <div className="w-full max-w-lg rounded-2xl bg-card border border-border/50 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">{editVideo?.id ? "Редактировать" : "Добавить"} видео</h2>
                <button onClick={() => setEditVideo(null)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <input value={editVideo?.title ?? ''} onChange={(e) => setEditVideo({ ...(editVideo ?? {}), title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="Название" />
                <textarea value={editVideo?.description ?? ''} onChange={(e) => setEditVideo({ ...(editVideo ?? {}), description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm resize-none" placeholder="Описание" />
                <input value={editVideo?.youtubeUrl ?? ''} onChange={(e) => setEditVideo({ ...(editVideo ?? {}), youtubeUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="YouTube URL" />
                <input value={editVideo?.thumbnailUrl ?? ''} onChange={(e) => setEditVideo({ ...(editVideo ?? {}), thumbnailUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="URL превью (необязательно)" />
                <input type="number" value={editVideo?.sortOrder ?? 0} onChange={(e) => setEditVideo({ ...(editVideo ?? {}), sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border/50 text-sm" placeholder="Порядок сортировки" />
                <button onClick={saveVideo} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFD8F] text-[#043915] font-semibold text-sm"><Save className="w-4 h-4" /> Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
