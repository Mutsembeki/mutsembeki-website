'use client'

import { useState } from 'react'
import { Check, X, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Testimony } from '@/types'

export function AdminTestimoniesClient({ initialTestimonies }: { initialTestimonies: Testimony[] }) {
  const [testimonies, setTestimonies] = useState(initialTestimonies)
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')

  const filtered = filter === 'all' ? testimonies : testimonies.filter(t => t.status === filter)

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
      const res = await fetch(`/api/admin/testemunhos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setTestimonies(prev => prev.map(t => (t.id === id ? { ...t, status } : t)))
      }
    } catch {}
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este testemunho?')) return
    try {
      const res = await fetch(`/api/admin/testemunhos/${id}`, { method: 'DELETE' })
      if (res.ok) setTestimonies(prev => prev.filter(t => t.id !== id))
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Testemunhos</h1>
        <p className="text-muted-foreground mt-1">{testimonies.filter(t => t.status === 'PENDING').length} aguardando aprovação</p>
      </div>

      <div className="flex gap-2">
        {[
          { value: 'PENDING', label: 'Pendentes' },
          { value: 'APPROVED', label: 'Aprovados' },
          { value: 'REJECTED', label: 'Rejeitados' },
          { value: 'all', label: 'Todos' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === value ? 'bg-gold text-background' : 'glass text-muted-foreground hover:text-gold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(t => (
          <div key={t.id} className="card-base space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-background font-bold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.city} · {formatDate(t.createdAt)}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${
                t.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                t.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {t.status === 'PENDING' ? 'Pendente' : t.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t.content}</p>
            <div className="flex gap-2 pt-2 border-t border-glass-border">
              {t.status !== 'APPROVED' && (
                <button onClick={() => updateStatus(t.id, 'APPROVED')} className="btn-primary text-sm gap-2">
                  <Check className="w-3 h-3" /> Aprovar
                </button>
              )}
              {t.status !== 'REJECTED' && (
                <button onClick={() => updateStatus(t.id, 'REJECTED')} className="btn-ghost border border-glass-border rounded-xl text-sm gap-2">
                  <X className="w-3 h-3" /> Rejeitar
                </button>
              )}
              <button onClick={() => handleDelete(t.id)} className="btn-ghost border border-glass-border rounded-xl text-sm gap-2 text-red-400 ml-auto">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p className="text-muted-foreground text-center py-16">Nenhum testemunho encontrado.</p>}
      </div>
    </div>
  )
}
