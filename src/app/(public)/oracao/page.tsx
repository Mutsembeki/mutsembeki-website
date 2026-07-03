'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Send, Lock, Globe, CheckCircle } from 'lucide-react'

export default function OracaoPage() {
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      city: formData.get('city'),
      request: formData.get('request'),
      isPublic,
    }

    try {
      const res = await fetch('/api/oracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold">
              <Heart className="w-8 h-8 text-background" fill="currentColor" />
            </div>
            <span className="badge">Intercessão</span>
            <h1 className="section-title">Pedidos de Oração</h1>
            <div className="gold-divider mx-auto" />
            <p className="text-muted-foreground max-w-xl mx-auto">
              Partilhe o seu pedido de oração. Acreditamos no poder da oração e estamos
              aqui para interceder por você perante o Senhor.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-base text-center space-y-6 py-12"
            >
              <CheckCircle className="w-16 h-16 text-gold mx-auto" />
              <h2 className="font-display text-2xl font-bold text-foreground">Pedido Recebido!</h2>
              <p className="text-muted-foreground">
                O seu pedido de oração foi enviado. Estaremos a interceder por você.
                &ldquo;A oração do justo é poderosa e eficaz.&rdquo; — Tiago 5:16
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-outline"
              >
                Enviar Outro Pedido
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="card-base space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome *</label>
                  <input name="name" required placeholder="Seu nome" className="input-base" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cidade</label>
                  <input name="city" placeholder="Sua cidade" className="input-base" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Pedido de Oração *</label>
                <textarea
                  name="request"
                  required
                  rows={6}
                  placeholder="Escreva aqui o seu pedido de oração..."
                  className="input-base resize-none"
                />
              </div>

              {/* Visibilidade */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Visibilidade</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isPublic ? 'border-gold bg-glass text-gold' : 'border-glass-border text-muted-foreground'
                    }`}
                  >
                    <Globe className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Público</p>
                      <p className="text-xs opacity-70">Visível na página de pedidos</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      !isPublic ? 'border-gold bg-glass text-gold' : 'border-glass-border text-muted-foreground'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Privado</p>
                      <p className="text-xs opacity-70">Apenas o pastor vê</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-base gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Enviando...' : 'Enviar Pedido de Oração'}
              </button>

              <p className="text-muted-foreground text-xs text-center">
                &ldquo;Não andeis ansiosos por coisa alguma; antes em tudo, pela oração e pela súplica, com ações de graças, fazei os vossos pedidos conhecidos diante de Deus.&rdquo; — Filipenses 4:6
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  )
}
