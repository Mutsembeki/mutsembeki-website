import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Letras',
  description: 'Letras de todas as músicas de Mutsembeki.',
}

export const revalidate = 1800

export default async function LetrasPage() {
  const songs = await prisma.song.findMany({
    where: { published: true, lyrics: { not: null } },
    orderBy: { releaseDate: 'desc' },
  })

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <span className="badge">Letras</span>
          <h1 className="section-title mt-4">Letras das Músicas</h1>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map(song => (
            <Link
              key={song.id}
              href={`/letras/${song.slug}`}
              className="card-base flex items-center gap-4 hover:border-gold/30 hover:shadow-gold-sm transition-all"
            >
              <div className="relative w-14 h-14 rounded-xl bg-brown flex-shrink-0 overflow-hidden">
                {song.coverImage ? (
                  <Image src={song.coverImage} alt={song.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gold" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{song.title}</h3>
                <p className="text-muted-foreground text-xs">Ver letra completa</p>
              </div>
            </Link>
          ))}
        </div>

        {songs.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Nenhuma letra disponível ainda.</p>
        )}
      </div>
    </div>
  )
}
