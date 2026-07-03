'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Download, Play, FileText, Share2, Headphones, SlidersHorizontal } from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import type { Song, Category, Album } from '@/types'

type SortOption = 'recent' | 'downloads' | 'views' | 'title'

interface MusicasClientProps {
  songs: Song[]
  categories: Category[]
  albums: Album[]
}

export function MusicasClient({ songs, categories, albums }: MusicasClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...songs]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.title.toLowerCase().includes(q))
    }

    if (selectedCategory !== 'all') {
      list = list.filter(s => s.categoryId === selectedCategory)
    }

    if (selectedAlbum !== 'all') {
      list = list.filter(s => s.albumId === selectedAlbum)
    }

    switch (sortBy) {
      case 'downloads':
        list.sort((a, b) => (b._count?.downloads ?? 0) - (a._count?.downloads ?? 0))
        break
      case 'views':
        list.sort((a, b) => (b._count?.views ?? 0) - (a._count?.views ?? 0))
        break
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // recent
        list.sort((a, b) => new Date(b.releaseDate ?? b.createdAt).getTime() - new Date(a.releaseDate ?? a.createdAt).getTime())
    }

    return list
  }, [songs, search, selectedCategory, selectedAlbum, sortBy])

  const handleDownload = async (songId: string) => {
    try {
      const response = await fetch(`/api/downloads/${songId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mutsembeki-${songId}.mp3`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro no download:', error)
    }
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="badge">Discografia</span>
            <h1 className="section-title">Todas as Músicas</h1>
            <div className="gold-divider" />
            <p className="text-muted-foreground max-w-xl">
              Ouça, baixe e seja abençoado pelas músicas de Mutsembeki. {songs.length} músicas disponíveis.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 md:p-6 mb-8 space-y-4"
        >
          {/* Pesquisa */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar músicas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-11"
            />
          </div>

          {/* Filtros linha 2 */}
          <div className="flex flex-wrap gap-3">
            {/* Categorias */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === 'all' ? 'bg-gold text-background' : 'glass text-muted-foreground hover:text-gold'
                }`}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.id ? 'bg-gold text-background' : 'glass text-muted-foreground hover:text-gold'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="bg-muted border border-glass-border text-foreground text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold"
              >
                <option value="recent">Mais Recentes</option>
                <option value="downloads">Mais Baixadas</option>
                <option value="views">Mais Ouvidas</option>
                <option value="title">Título A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Resultados */}
        <p className="text-muted-foreground text-sm mb-6">
          {filtered.length} músicas encontradas
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((song, i) => (
              <motion.div
                key={song.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="card-base group hover:border-gold/30 hover:shadow-gold-sm transition-all"
              >
                {/* Capa */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-brown">
                  {song.coverImage ? (
                    <Image src={song.coverImage} alt={song.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-card-gradient flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-gradient opacity-60">{song.title[0]}</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {song.audioUrl && (
                      <button
                        onClick={() => setCurrentPlaying(currentPlaying === song.id ? null : song.id)}
                        className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-gold hover:scale-110 transition-transform"
                      >
                        <Play className="w-5 h-5 text-background" fill="currentColor" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors truncate mb-1">
                  {song.title}
                </h3>

                {song.category && (
                  <span className="text-xs text-gold">{song.category.name}</span>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 mb-4">
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3 h-3" />{formatNumber(song._count?.views ?? 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />{formatNumber(song._count?.downloads ?? 0)}
                  </span>
                </div>

                {/* Player inline */}
                {currentPlaying === song.id && song.audioUrl && (
                  <audio src={song.audioUrl} controls autoPlay className="w-full mb-3" />
                )}

                {/* Ações */}
                <div className="flex gap-2">
                  {song.audioUrl && (
                    <button
                      onClick={() => handleDownload(song.id)}
                      className="btn-primary flex-1 text-xs py-2"
                    >
                      <Download className="w-3 h-3" />
                      Baixar
                    </button>
                  )}
                  {song.lyrics && (
                    <Link href={`/letras/${song.slug}`} className="btn-ghost border border-glass-border rounded-lg px-3 py-2">
                      <FileText className="w-3 h-3" />
                    </Link>
                  )}
                  <button
                    onClick={() => navigator.share?.({ title: song.title, url: `/musicas/${song.slug}` })}
                    className="btn-ghost border border-glass-border rounded-lg px-3 py-2"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <p className="text-4xl">🎵</p>
            <p className="text-muted-foreground">Nenhuma música encontrada para a pesquisa.</p>
            <button onClick={() => { setSearch(''); setSelectedCategory('all') }} className="btn-outline text-sm">
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
