'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, BookOpen } from 'lucide-react'
import { formatDate, slugify } from '@/lib/utils'
import type { BlogPost } from '@/types'

const categories = [
  { value: 'REFLEXOES', label: 'Reflexões' },
  { value: 'DEVOCIONAIS', label: 'Devocionais' },
  { value: 'MENSAGENS', label: 'Mensagens' },
  { value: 'NOTICIAS', label: 'Notícias' },
]

export function AdminBlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setIsModalOpen(true)
  }

  function openEdit(post: BlogPost) {
    setEditing(post)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este artigo?')) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
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
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const result = await res.json()
        if (editing) {
          setPosts(prev => prev.map(p => (p.id === editing.id ? result.post : p)))
        } else {
          setPosts(prev => [result.post, ...prev])
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
          <h1 className="font-display text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-1">{posts.length} artigos cadastrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Novo Artigo
        </button>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Título</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Categoria</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Data</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              <th className="text-right p-4 text-muted-foreground text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-glass-border last:border-0 hover:bg-glass">
                <td className="p-4 text-foreground text-sm font-medium">{post.title}</td>
                <td className="p-4 text-muted-foreground text-sm">{categories.find(c => c.value === post.category)?.label}</td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(post.createdAt)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(post)} className="p-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-glass">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nenhum artigo cadastrado ainda.</p>
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
              className="bg-card border border-glass-border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">{editing ? 'Editar Artigo' : 'Novo Artigo'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" required defaultValue={editing?.title} placeholder="Título do artigo" className="input-base" />
                <select name="category" defaultValue={editing?.category ?? 'REFLEXOES'} className="input-base">
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <input name="excerpt" defaultValue={editing?.excerpt ?? ''} placeholder="Resumo curto (excerpt)" className="input-base" />
                <input name="coverImage" defaultValue={editing?.coverImage ?? ''} placeholder="URL da imagem de capa (opcional)" className="input-base" />
                <textarea name="content" required defaultValue={editing?.content ?? ''} rows={10} placeholder="Conteúdo completo do artigo..." className="input-base resize-none" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="published" defaultChecked={editing?.published ?? false} className="w-4 h-4 accent-gold" />
                  <span className="text-sm text-foreground">Publicar artigo</span>
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
