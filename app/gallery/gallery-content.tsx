"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ImageIcon } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  category: string | null;
}

function getYoutubeId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return match?.[1] ?? null;
}

export function GalleryContent() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((d) => setVideos(d ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">Галерея <span className="text-[#FFFD8F]">работ</span></h1>
        <p className="text-muted-foreground text-lg">Портфолио наших лучших проектов</p>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4"><div className="h-5 bg-muted rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : (videos?.length ?? 0) === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Видео скоро появятся</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(videos ?? []).map((video: VideoItem, i: number) => {
            const ytId = getYoutubeId(video?.youtubeUrl);
            const thumb = video?.thumbnailUrl || (ytId ? `https://randomtools.io/blog/wp-content/uploads/2019/11/image_2019_11_27T07_50_55_966Z.png` : null);
            return (
              <motion.div
                key={video?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-[#FFFD8F]/30 transition-all cursor-pointer"
                onClick={() => ytId && setActiveVideo(ytId)}
              >
                <div className="relative aspect-video bg-muted">
                  {thumb && (
                    <img src={thumb} alt={video?.title ?? ''} className="w-full h-full object-cover" />
                  )}
                  {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-[#FFFD8F] flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#043915] ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{video?.title ?? ''}</h3>
                  {video?.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                className="w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
