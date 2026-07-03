'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

const subjects = [
  'Convite para Evento',
  'Parceria Ministerial',
  'Imprensa e Media',
  'Apoio Técnico',
  'Outro Assunto',
]

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/contacto', {
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
        <div className="container-max px-4 md:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <span className="badge">Fale Connosco</span>
            <h1 className="section-title">Contacto</h1>
            <div className="gold-divider" />
          </motion.div>
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info lateral */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Informações de Contacto</h2>
            {[
              { icon: Mail, label: 'Email', value: 'contacto@mutsembeki.com' },
              { icon: Phone, label: 'WhatsApp', value: '+258 84 000 0000' },
              { icon: MapPin, label: 'Localização', value: 'Maputo, Moçambique' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
                  <Icon className="w-5 h-5 text-background" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-foreground font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-base text-center space-y-4 py-12"
              >
                <CheckCircle className="w-16 h-16 text-gold mx-auto" />
                <h2 className="font-display text-2xl font-bold">Mensagem Enviada!</h2>
                <p className="text-muted-foreground">Obrigado pelo contacto. Responderemos em breve.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="card-base space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nome *</label>
                    <input name="name" required placeholder="Seu nome" className="input-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <input name="email" type="email" required placeholder="seu@email.com" className="input-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Telefone</label>
                    <input name="phone" placeholder="+258 XX XXX XXXX" className="input-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assunto *</label>
                    <select name="subject" required className="input-base">
                      <option value="">Selecione...</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mensagem *</label>
                  <textarea name="message" required rows={5} placeholder="Escreva a sua mensagem..." className="input-base resize-none" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-base gap-2">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
