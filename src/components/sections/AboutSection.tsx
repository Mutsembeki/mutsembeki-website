'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Quote, Calendar, MapPin, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Testimony, Event } from '@/types'

// ── ABOUT ──────────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section className="section-padding bg-brown/10 border-y border-glass-border">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="badge">Sobre o Artista</span>
            <h2 className="section-title">Chamado para Glorificar a Deus</h2>
            <div className="gold-divider" />
            <p className="text-muted-foreground leading-relaxed">
              Mutsembeki é um ministério musical nascido da paixão de proclamar a Palavra de Deus através da música.
              Com raízes profundas na fé cristã, cada composição é uma expressão genuína de louvor, adoração e testemunho.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              O chamado ministerial é claro: levar mensagens de esperança, restauração e salvação a cada coração que ouve,
              usando a música como ponte entre o céu e a terra.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: 'Missão', desc: 'Evangelizar através da música' },
                { label: 'Visão', desc: 'Alcançar nações para Cristo' },
                { label: 'Valores', desc: 'Fé, Integridade, Excelência' },
              ].map(({ label, desc }) => (
                <div key={label} className="glass rounded-xl p-4 text-center">
                  <p className="text-gold font-semibold text-sm mb-1">{label}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/sobre" className="btn-outline self-start">
              Conhecer Mais
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline da carreira */}
            <div className="space-y-6">
              {[
                { year: '2018', event: 'Início do ministério musical', desc: 'Primeiras composições e apresentações locais' },
                { year: '2020', event: 'Primeiro álbum gravado', desc: 'Gravação e produção do primeiro trabalho discográfico' },
                { year: '2022', event: 'Expansão do ministério', desc: 'Participação em eventos e conferências regionais' },
                { year: '2024', event: 'Lançamento digital', desc: 'Presença nas plataformas digitais e streaming' },
              ].map(({ year, event, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
                      <span className="text-background text-xs font-bold">{year.slice(2)}</span>
                    </div>
                    {i < 3 && <div className="w-px h-full bg-gold/20 mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-gold text-xs font-semibold uppercase tracking-wider">{year}</p>
                    <p className="text-foreground font-medium">{event}</p>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── PRAYER CTA ─────────────────────────────────────────────────────────────

export function PrayerCTA() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-glass-border"
          style={{
            background: 'linear-gradient(135deg, rgba(45,27,18,0.8) 0%, rgba(5,5,5,0.9) 100%)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }}
          />

          <div className="relative z-10 p-12 md:p-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold">
              <Heart className="w-8 h-8 text-background" fill="currentColor" />
            </div>
            <h2 className="section-title">Precisa de Oração?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Estamos aqui para interceder por você. Envie o seu pedido de oração e
              acreditamos que Deus vai responder. Você não está sozinho.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/oracao" className="btn-primary gap-2 px-8 py-4 text-base">
                <Heart className="w-5 h-5" />
                Enviar Pedido de Oração
              </Link>
              <Link href="/testemunhos" className="btn-outline gap-2 px-8 py-4 text-base">
                Ver Testemunhos
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── TESTIMONIES ─────────────────────────────────────────────────────────────

export function TestimoniesSection({ testimonies }: { testimonies: Testimony[] }) {
  if (!testimonies.length) return null

  return (
    <section className="section-padding bg-brown/10 border-y border-glass-border">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-12"
        >
          <span className="badge">Histórias de Vida</span>
          <h2 className="section-title">Testemunhos</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonies.map((testimony, i) => (
            <motion.div
              key={testimony.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-base space-y-4"
            >
              <Quote className="w-8 h-8 text-gold opacity-60" />
              <p className="text-muted-foreground leading-relaxed">{testimony.content}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-glass-border">
                <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-background font-bold text-sm">{testimony.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{testimony.name}</p>
                  {testimony.city && <p className="text-muted-foreground text-xs">{testimony.city}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/testemunhos" className="btn-outline">Ver Todos os Testemunhos</Link>
        </div>
      </div>
    </section>
  )
}

// ── EVENTS ─────────────────────────────────────────────────────────────────

export function EventsSection({ events }: { events: Event[] }) {
  if (!events.length) return null

  return (
    <section className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-3">
            <span className="badge">Agenda</span>
            <h2 className="section-title">Próximos Eventos</h2>
            <div className="gold-divider" />
          </div>
          <Link href="/eventos" className="btn-outline text-sm self-start md:self-auto">
            Ver Todos
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-base space-y-4 hover:border-gold/30 hover:shadow-gold-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm flex-shrink-0">
                  <Calendar className="w-6 h-6 text-background" />
                </div>
                <div>
                  <p className="text-gold text-xs font-semibold uppercase tracking-wider">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">{event.title}</h3>
              {event.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
              )}
              {event.location && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── NEWSLETTER ─────────────────────────────────────────────────────────────

export function NewsletterSection() {
  return (
    <section className="section-padding bg-brown/10 border-t border-glass-border">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold">
            <Mail className="w-7 h-7 text-background" />
          </div>
          <h2 className="section-title">Fique Por Dentro</h2>
          <div className="gold-divider mx-auto" />
          <p className="text-muted-foreground">
            Inscreva-se e receba novos lançamentos, devocionais e notícias do ministério directamente no seu email.
          </p>

          <form
            action="/api/newsletter"
            method="POST"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              className="input-base flex-1"
            />
            <input
              type="email"
              name="email"
              placeholder="Seu email"
              required
              className="input-base flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap px-6">
              Subscrever
            </button>
          </form>

          <p className="text-muted-foreground text-xs">
            Não enviamos spam. Pode cancelar a qualquer momento.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
