'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Video as VideoIcon } from 'lucide-react'
import { getYouTubeThumbnail } from '@/lib/utils'

interface Video {
  id: string
  title: string
  youtubeUrl: string
  category: string
  published: boolean
}

const categoryOptions = ['Vídeos Recentes', 'Vídeos Populares', 'Pregações', 'Testemunhos']

export function AdminVideosClient({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Video | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setIsModalOpen(true)
  }

  function openEdit(video: Video) {
    setEditing(video)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este vídeo?')) return
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
    if (res.ok) setVideos(prev => prev.filter(v => v.id !== id))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      ...Object.fromEntries(formData.entries()),
      published: formData.get('published') === 'on',
    }

    try {
      const url = editing ? `/api/admin/videos/${editing.id}` : '/api/admin/videos'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const result = await res.json()
        if (editing) {
          setVideos(prev => prev.map(v => (v.id === editing.id ? result.video : v)))
        } else {
          setVideos(prev => [result.video, ...prev])
        }
        setIsModalOpen(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Vídeos</h1>
          <p className="text-muted-foreground mt-1">{videos.length} vídeos cadastrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Novo Vídeo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className="card-base space-y-3">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-brown">
              <img src={getYouTubeThumbnail(video.youtubeUrl) ?? ''} alt={video.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-display font-semibold text-foreground line-clamp-2">{video.title}</h3>
            <div className="flex items-center justify-between">
              <span className="badge">{video.category}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${video.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {video.published ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            <div className="flex gap-2 pt-2 border-t border-glass-border">
              <button onClick={() => openEdit(video)} className="btn-ghost border border-glass-border rounded-lg text-sm flex-1 gap-1">
                <Edit2 className="w-3 h-3" /> Editar
              </button>
              <button onClick={() => handleDelete(video.id)} className="btn-ghost border border-glass-border rounded-lg text-sm text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="col-span-3 text-center py-16 space-y-3">
            <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nenhum vídeo cadastrado ainda.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-glass-border rounded-3xl p-8 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">{editing ? 'Editar Vídeo' : 'Novo Vídeo'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" required defaultValue={editing?.title} placeholder="Título do vídeo" className="input-base" />
                <input name="youtubeUrl" required defaultValue={editing?.youtubeUrl} placeholder="https://youtube.com/watch?v=..." className="input-base" />
                <select name="category" defaultValue={editing?.category ?? categoryOptions[0]} className="input-base">
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="w-4 h-4 accent-gold" />
                  <span className="text-sm text-foreground">Publicado</span>
                </label>
                <div className="flex gap-3 pt-4 border-t border-glass-border">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost border border-glass-border rounded-xl flex-1">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex-1">{isSaving ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
