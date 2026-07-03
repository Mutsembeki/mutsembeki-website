'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/utils'

interface Video {
  id: string
  title: string
  youtubeUrl: string
  category: string
}

export function VideosClient({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(videos.map(v => v.category)))
    return cats.map(cat => ({ name: cat, videos: videos.filter(v => v.category === cat) }))
  }, [videos])

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <span className="badge">Galeria Audiovisual</span>
          <h1 className="section-title mt-4">Vídeos</h1>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12 space-y-12">
        {categories.map(({ name, videos: catVideos }) => (
          <div key={name}>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">{name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catVideos.map((video, i) => (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveVideo(video)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-brown text-left"
                >
                  <img
                    src={getYouTubeThumbnail(video.youtubeUrl) ?? ''}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-gold">
                      <Play className="w-5 h-5 text-background" fill="currentColor" />
                    </div>
                  </div>
                  <p className="absolute bottom-3 left-3 right-3 text-foreground text-sm font-medium line-clamp-2">
                    {video.title}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de vídeo */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-foreground hover:text-gold transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(activeVideo.youtubeUrl)}?autoplay=1`}
              className="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
