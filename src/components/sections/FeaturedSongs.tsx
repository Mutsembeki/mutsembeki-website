'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Download, FileText, Share2, Headphones } from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import type { Song } from '@/types'

interface FeaturedSongsProps {
  songs: Song[]
}

export function FeaturedSongs({ songs }: FeaturedSongsProps) {
  if (!songs.length) return null

  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-3">
            <span className="badge">Em Destaque</span>
            <h2 className="section-title">Músicas em Destaque</h2>
            <div className="gold-divider" />
          </div>
          <Link href="/musicas" className="btn-outline text-sm self-start md:self-auto">
            Ver Todas as Músicas
          </Link>
        </motion.div>

        {/* Grid de músicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song, i) => (
            <SongCard key={song.id} song={song} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SongCard({ song, index }: { song: Song; index: number }) {
  const downloads = song._count?.downloads ?? 0
  const views = song._count?.views ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="card-base group cursor-pointer hover:border-gold/30 hover:shadow-gold-sm"
    >
      {/* Capa */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-brown">
        {song.coverImage ? (
          <Image
            src={song.coverImage}
            alt={song.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-card-gradient flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-gradient opacity-60">
              {song.title[0]}
            </span>
          </div>
        )}

        {/* Overlay play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-gold">
            <Play className="w-6 h-6 text-background" fill="currentColor" />
          </div>
        </div>

        {/* Category badge */}
        {song.category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium text-background"
              style={{ background: song.category.color || '#FFD700' }}
            >
              {song.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-gold transition-colors truncate">
          {song.title}
        </h3>

        {song.releaseDate && (
          <p className="text-muted-foreground text-xs">{formatDate(song.releaseDate)}</p>
        )}

        {/* Estatísticas */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Headphones className="w-3 h-3" />
            {formatNumber(views)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {formatNumber(downloads)}
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 pt-2 border-t border-glass-border">
          {song.audioUrl && (
            <a
              href={`/api/downloads/${song.id}`}
              className="btn-primary flex-1 text-xs py-2 justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-3 h-3" />
              Baixar
            </a>
          )}
          {song.lyrics && (
            <Link
              href={`/letras/${song.slug}`}
              className="btn-ghost text-xs py-2 px-3 border border-glass-border rounded-lg"
            >
              <FileText className="w-3 h-3" />
              Letra
            </Link>
          )}
          <button
            className="btn-ghost text-xs py-2 px-3 border border-glass-border rounded-lg"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: song.title, url: `/musicas/${song.slug}` })
              }
            }}
          >
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
