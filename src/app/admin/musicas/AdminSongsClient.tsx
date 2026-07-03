'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, Music, Download, Headphones, Star } from 'lucide-react'
import { formatNumber, formatDate, slugify } from '@/lib/utils'
import type { Song, Category, Album } from '@/types'

interface AdminSongsClientProps {
  initialSongs: Song[]
  categories: Category[]
  albums: Album[]
}

export function AdminSongsClient({ initialSongs, categories, albums }: AdminSongsClientProps) {
  const [songs, setSongs] = useState(initialSongs)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  function openCreateModal() {
    setEditingSong(null)
    setCoverFile(null)
    setAudioFile(null)
    setCoverPreview(null)
    setIsModalOpen(true)
  }

  function openEditModal(song: Song) {
    setEditingSong(song)
    setCoverFile(null)
    setAudioFile(null)
    setCoverPreview(song.coverImage)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.')) return

    try {
      const res = await fetch(`/api/admin/musicas/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSongs(prev => prev.filter(s => s.id !== id))
      } else {
        alert('Erro ao excluir música.')
      }
    } catch {
      alert('Erro ao excluir música.')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    if (coverFile) formData.set('cover', coverFile)
    if (audioFile) formData.set('audio', audioFile)

    try {
      const url = editingSong ? `/api/admin/musicas/${editingSong.id}` : '/api/admin/musicas'
      const method = editingSong ? 'PUT' : 'POST'

      const res = await fetch(url, { method, body: formData })

      if (res.ok) {
        const data = await res.json()
        if (editingSong) {
          setSongs(prev => prev.map(s => (s.id === editingSong.id ? data.song : s)))
        } else {
          setSongs(prev => [data.song, ...prev])
        }
        setIsModalOpen(false)
      } else {
        const err = await res.json()
        alert(err.error || 'Erro ao salvar música.')
      }
    } catch {
      alert('Erro ao salvar música.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Músicas</h1>
          <p className="text-muted-foreground mt-1">{songs.length} músicas no total</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Nova Música
        </button>
      </div>

      {/* Tabela */}
      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Música</th>
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Categoria</th>
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Lançamento</th>
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Reproduções</th>
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Downloads</th>
                <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-muted-foreground text-xs uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id} className="border-b border-glass-border last:border-0 hover:bg-glass transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brown flex-shrink-0 overflow-hidden relative">
                        {song.coverImage ? (
                          <Image src={song.coverImage} alt={song.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-4 h-4 text-gold" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground font-medium truncate flex items-center gap-1.5">
                          {song.title}
                          {song.featured && <Star className="w-3 h-3 text-gold fill-gold" />}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {song.category ? (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${song.category.color}20`, color: song.category.color ?? undefined }}>
                        {song.category.name}
                      </span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {song.releaseDate ? formatDate(song.releaseDate) : '—'}
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Headphones className="w-3 h-3" />{formatNumber(song._count?.views ?? 0)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Download className="w-3 h-3" />{formatNumber(song._count?.downloads ?? 0)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${song.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {song.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(song)} className="p-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-glass transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(song.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {songs.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Music className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nenhuma música cadastrada ainda.</p>
            <button onClick={openCreateModal} className="btn-outline text-sm">Criar primeira música</button>
          </div>
        )}
      </div>

      {/* Modal de criação/edição */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-glass-border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {editingSong ? 'Editar Música' : 'Nova Música'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-glass">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Título *</label>
                  <input name="title" required defaultValue={editingSong?.title} placeholder="Nome da música" className="input-base" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Categoria</label>
                    <select name="categoryId" defaultValue={editingSong?.categoryId ?? ''} className="input-base">
                      <option value="">Sem categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Álbum</label>
                    <select name="albumId" defaultValue={editingSong?.albumId ?? ''} className="input-base">
                      <option value="">Single</option>
                      {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Data de Lançamento</label>
                    <input
                      type="date"
                      name="releaseDate"
                      defaultValue={editingSong?.releaseDate ? new Date(editingSong.releaseDate).toISOString().split('T')[0] : ''}
                      className="input-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Link YouTube</label>
                    <input name="youtubeUrl" defaultValue={editingSong?.youtubeUrl ?? ''} placeholder="https://youtube.com/..." className="input-base" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Upload capa */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Capa</label>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-glass-border rounded-xl p-6 cursor-pointer hover:border-gold/50 transition-colors">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">{coverFile?.name || 'Escolher imagem'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setCoverFile(file)
                            setCoverPreview(URL.createObjectURL(file))
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Upload áudio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Áudio MP3</label>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-glass-border rounded-xl p-6 cursor-pointer hover:border-gold/50 transition-colors h-full">
                      <Music className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">
                        {audioFile?.name || (editingSong?.audioUrl ? 'Áudio já enviado (substituir)' : 'Escolher MP3')}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={e => setAudioFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Letra da Música</label>
                  <textarea
                    name="lyrics"
                    rows={8}
                    defaultValue={editingSong?.lyrics ?? ''}
                    placeholder="[Verso 1]&#10;...&#10;&#10;[Refrão]&#10;..."
                    className="input-base resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" defaultChecked={editingSong?.featured} className="w-4 h-4 accent-gold" />
                    <span className="text-sm text-foreground">Música em destaque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="published" defaultChecked={editingSong?.published ?? true} className="w-4 h-4 accent-gold" />
                    <span className="text-sm text-foreground">Publicado</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-glass-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost border border-glass-border rounded-xl flex-1">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex-1">
                    {isSaving ? 'Salvando...' : editingSong ? 'Atualizar Música' : 'Criar Música'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
