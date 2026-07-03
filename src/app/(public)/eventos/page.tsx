import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Próximos eventos, concertos e apresentações de Mutsembeki.',
}

export const revalidate = 1800

export default async function EventosPage() {
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    }),
    prisma.event.findMany({
      where: { published: true, date: { lt: new Date() } },
      orderBy: { date: 'desc' },
      take: 6,
    }),
  ])

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <span className="badge">Agenda</span>
          <h1 className="section-title mt-4">Eventos</h1>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12 space-y-16">
        {/* Próximos */}
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Próximos Eventos</h2>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">Nenhum evento agendado no momento. Acompanhe as nossas redes sociais para novidades.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map(event => (
                <div key={event.id} className="card-base hover:border-gold/30 transition-all">
                  {event.imageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-brown">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gold text-sm font-semibold mb-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                  {event.description && <p className="text-muted-foreground text-sm mb-4">{event.description}</p>}
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                      {event.location}
                    </div>
                  )}
                  {event.mapUrl && (
                    <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm gap-2 inline-flex">
                      Ver no Mapa <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Passados */}
        {past.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Eventos Anteriores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {past.map(event => (
                <div key={event.id} className="card-base opacity-70">
                  <p className="text-muted-foreground text-xs mb-2">{formatDate(event.date)}</p>
                  <h3 className="font-display font-semibold text-foreground">{event.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
