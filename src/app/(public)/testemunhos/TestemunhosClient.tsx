'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Plus, X, CheckCircle, Send } from 'lucide-react'
import type { Testimony } from '@/types'

export function TestemunhosClient({ testimonies }: { testimonies: Testimony[] }) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/testemunhos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmitted(true)
    } catch {}
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16 text-center">
          <span className="badge">Histórias de Vida</span>
          <h1 className="section-title mt-4">Testemunhos</h1>
          <div className="gold-divider mt-4 mx-auto" />
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Vidas transformadas pela música e pela Palavra. Partilhe também a sua história.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-6 gap-2">
            <Plus className="w-4 h-4" />
            Partilhar Meu Testemunho
          </button>
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-base space-y-4"
            >
              <Quote className="w-8 h-8 text-gold opacity-60" />
              <p className="text-muted-foreground leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-glass-border">
                <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-background font-bold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{t.name}</p>
                  {t.city && <p className="text-muted-foreground text-xs">{t.city}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonies.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Nenhum testemunho disponível ainda. Seja o primeiro a partilhar!</p>
        )}
      </div>

      {/* Modal de submissão */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-glass-border rounded-3xl p-8 max-w-lg w-full"
          >
            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <CheckCircle className="w-14 h-14 text-gold mx-auto" />
                <h2 className="font-display text-xl font-bold text-foreground">Testemunho Enviado!</h2>
                <p className="text-muted-foreground text-sm">
                  O seu testemunho será revisto pela equipa e publicado em breve.
                </p>
                <button onClick={() => setShowForm(false)} className="btn-outline">Fechar</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground">Partilhar Testemunho</h2>
                  <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-gold">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="name" required placeholder="Seu nome" className="input-base" />
                  <input name="city" placeholder="Sua cidade (opcional)" className="input-base" />
                  <textarea name="content" required rows={5} placeholder="Conte a sua história de transformação..." className="input-base resize-none" />
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full gap-2">
                    {isSubmitting ? 'Enviando...' : <><Send className="w-4 h-4" />Enviar Testemunho</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
