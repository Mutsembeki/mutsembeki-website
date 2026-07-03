'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Lock, Globe, Send, Archive, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PrayerRequest } from '@/types'

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'RESPONDED', label: 'Respondidos' },
  { value: 'ARCHIVED', label: 'Arquivados' },
]

export function AdminPrayerClient({ initialPrayers }: { initialPrayers: PrayerRequest[] }) {
  const [prayers, setPrayers] = useState(initialPrayers)
  const [filter, setFilter] = useState('all')
  const [responding, setResponding] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  const filtered = filter === 'all' ? prayers : prayers.filter(p => p.status === filter)

  async function handleRespond(id: string) {
    if (!responseText.trim()) return

    try {
      const res = await fetch(`/api/admin/oracao/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText, status: 'RESPONDED' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPrayers(prev => prev.map(p => (p.id === id ? data.prayer : p)))
        setResponding(null)
        setResponseText('')
      }
    } catch {}
  }

  async function handleArchive(id: string) {
    try {
      const res = await fetch(`/api/admin/oracao/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPrayers(prev => prev.map(p => (p.id === id ? data.prayer : p)))
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Pedidos de Oração</h1>
        <p className="text-muted-foreground mt-1">{prayers.filter(p => p.status === 'PENDING').length} pedidos pendentes</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === value ? 'bg-gold text-background' : 'glass text-muted-foreground hover:text-gold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {filtered.map(prayer => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-background font-bold">{prayer.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">{prayer.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {prayer.city && <span>{prayer.city}</span>}
                    <span>{formatDate(prayer.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      {prayer.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {prayer.isPublic ? 'Público' : 'Privado'}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${
                prayer.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                prayer.status === 'RESPONDED' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {prayer.status === 'PENDING' ? 'Pendente' : prayer.status === 'RESPONDED' ? 'Respondido' : 'Arquivado'}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed bg-glass rounded-xl p-4 border-l-2 border-gold">
              {prayer.request}
            </p>

            {prayer.response && (
              <div className="bg-glass rounded-xl p-4 border-l-2 border-green-500">
                <p className="text-xs text-green-400 font-medium mb-1">Sua resposta:</p>
                <p className="text-muted-foreground text-sm">{prayer.response}</p>
              </div>
            )}

            {responding === prayer.id ? (
              <div className="space-y-2">
                <textarea
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  rows={3}
                  placeholder="Escreva a sua resposta de oração..."
                  className="input-base resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(prayer.id)} className="btn-primary text-sm gap-2">
                    <Send className="w-3 h-3" />
                    Enviar Resposta
                  </button>
                  <button onClick={() => setResponding(null)} className="btn-ghost border border-glass-border rounded-xl text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              prayer.status !== 'ARCHIVED' && (
                <div className="flex gap-2">
                  {!prayer.response && (
                    <button onClick={() => setResponding(prayer.id)} className="btn-outline text-sm gap-2">
                      <Heart className="w-3 h-3" />
                      Responder
                    </button>
                  )}
                  <button onClick={() => handleArchive(prayer.id)} className="btn-ghost border border-glass-border rounded-xl text-sm gap-2">
                    <Archive className="w-3 h-3" />
                    Arquivar
                  </button>
                </div>
              )
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Nenhum pedido de oração encontrado.</p>
        )}
      </div>
    </div>
  )
}
