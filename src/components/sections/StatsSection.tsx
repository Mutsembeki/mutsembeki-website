'use client'

import { motion } from 'framer-motion'
import { Download, Headphones, Music, Users } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatsSectionProps {
  downloads: number
  views: number
  songs: number
  subscribers: number
}

const statConfig = [
  { key: 'songs', icon: Music, label: 'Músicas Disponíveis', color: '#FFD700' },
  { key: 'views', icon: Headphones, label: 'Reproduções', color: '#F4C542' },
  { key: 'downloads', icon: Download, label: 'Downloads', color: '#D4AF37' },
  { key: 'subscribers', icon: Users, label: 'Inscritos na Newsletter', color: '#B8860B' },
]

export function StatsSection({ downloads, views, songs, subscribers }: StatsSectionProps) {
  const values = { downloads, views, songs, subscribers }

  return (
    <section className="py-16 border-y border-glass-border bg-brown/20">
      <div className="container-max px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statConfig.map(({ key, icon: Icon, label, color }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center space-y-3 hover:border-gold/30 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <p className="text-3xl font-display font-bold text-gradient">
                {formatNumber(values[key as keyof typeof values])}
              </p>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
