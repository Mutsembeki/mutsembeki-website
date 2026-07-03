'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Download, Heart } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 bg-pattern opacity-40" />

      {/* Orbes de luz */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8"
        style={{ background: 'radial-gradient(circle, #F4C542, transparent)' }}
      />

      <div className="container-max relative z-10 px-4 md:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo textual */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="badge">🎵 Ministério Musical Gospel</span>
            </motion.div>

            {/* Nome do artista */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
            >
              <span className="text-gradient text-glow">MUTS</span>
              <br />
              <span className="text-foreground">EMBEKI</span>
            </motion.h1>

            {/* Frase inspiradora */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              &ldquo;Música que toca o coração, eleva o espírito e glorifica o nome do Senhor.
              Cada nota, uma oração. Cada letra, uma mensagem de amor.&rdquo;
            </motion.p>

            {/* Botões de ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/musicas" className="btn-primary gap-2 px-8 py-4 text-base">
                <Play className="w-5 h-5" fill="currentColor" />
                Ouvir Agora
              </Link>
              <Link href="/musicas" className="btn-outline gap-2 px-8 py-4 text-base">
                <Download className="w-5 h-5" />
                Baixar Músicas
              </Link>
              <Link href="/oracao" className="btn-ghost gap-2 px-8 py-4 text-base border border-glass-border rounded-xl">
                <Heart className="w-5 h-5 text-gold" />
                Pedido de Oração
              </Link>
            </motion.div>

            {/* Estatísticas rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { label: 'Músicas', value: '20+' },
                { label: 'Downloads', value: '5K+' },
                { label: 'Fiéis', value: '2K+' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-display font-bold text-gradient">{value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Imagem do artista */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Halo dourado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-80 h-80 md:w-96 md:h-96 rounded-full animate-glow-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Frame da foto */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-72 h-72 md:w-96 md:h-96"
            >
              <div className="w-full h-full rounded-3xl overflow-hidden glass border-2 border-glass-border shadow-gold-lg">
                {/* Placeholder – substituir por Image real quando tiver foto */}
                <div className="w-full h-full bg-card-gradient flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gold-gradient mx-auto flex items-center justify-center shadow-gold">
                      <span className="text-4xl font-display font-bold text-background">M</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Adicionar foto do artista</p>
                    <p className="text-xs text-muted-foreground">Substitua em: /public/images/artist.jpg</p>
                  </div>
                </div>
                {/* Quando tiver foto, use:
                <Image
                  src="/images/artist.jpg"
                  alt="Mutsembeki"
                  fill
                  className="object-cover object-top"
                  priority
                />
                */}
              </div>

              {/* Decoração – anel exterior */}
              <div className="absolute -inset-2 rounded-3xl border border-gold/20" />
              <div className="absolute -inset-4 rounded-3xl border border-gold/10" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Explorar</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-glass-border flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  )
}
