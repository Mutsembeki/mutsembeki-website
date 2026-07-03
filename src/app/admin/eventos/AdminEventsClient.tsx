'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/types'

export function AdminEventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setIsModalOpen(true)
  }

  function openEdit(event: Event) {
    setEditing(event)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este evento?')) return
    const res = await fetch(`/api/admin/eventos/${id}`, { method: 'DELETE' })
    if (res.ok) setEvents(prev => prev.filter(e => e.id !== id))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const url = editing ? `/api/admin/eventos/${editing.id}` : '/api/admin/eventos'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const result = await res.json()
        if (editing) {
          setEvents(prev => prev.map(ev => (ev.id === editing.id ? result.event : ev)))
        } else {
          setEvents(prev => [result.event, ...prev])
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
          <h1 className="font-display text-3xl font-bold text-foreground">Eventos</h1>
          <p className="text-muted-foreground mt-1">{events.length} eventos cadastrados</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="card-base space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(event)} className="p-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-glass">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{event.title}</h3>
            {event.description && <p className="text-muted-foreground text-sm">{event.description}</p>}
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-gold" />
                {event.location}
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && <p className="text-muted-foreground text-center py-16 col-span-2">Nenhum evento cadastrado.</p>}
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
                <h2 className="font-display text-xl font-bold text-foreground">{editing ? 'Editar Evento' : 'Novo Evento'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" required defaultValue={editing?.title} placeholder="Título do evento" className="input-base" />
                <input
                  type="datetime-local"
                  name="date"
                  required
                  defaultValue={editing ? new Date(editing.date).toISOString().slice(0, 16) : ''}
                  className="input-base"
                />
                <input name="location" defaultValue={editing?.location ?? ''} placeholder="Localização" className="input-base" />
                <input name="mapUrl" defaultValue={editing?.mapUrl ?? ''} placeholder="Link do Google Maps (opcional)" className="input-base" />
                <textarea name="description" defaultValue={editing?.description ?? ''} rows={4} placeholder="Descrição do evento" className="input-base resize-none" />
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
