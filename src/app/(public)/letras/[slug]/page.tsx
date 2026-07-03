import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Printer, Download, ArrowLeft } from 'lucide-react'
import { PrintButton } from './PrintButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const song = await prisma.song.findUnique({ where: { slug } })
  if (!song) return {}
  return {
    title: `Letra: ${song.title}`,
    description: `Letra completa da música ${song.title} de Mutsembeki.`,
  }
}

export const revalidate = 1800

export default async function LetraPage({ params }: PageProps) {
  const { slug } = await params
  const song = await prisma.song.findUnique({
    where: { slug, published: true },
    include: { category: true },
  })

  if (!song || !song.lyrics) notFound()

  return (
    <div className="min-h-screen pt-24">
      <div className="container-max px-4 md:px-8 py-12">
        <Link href="/letras" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Letras
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="card-base space-y-8 print:bg-white print:text-black print:border-none">
            {/* Header */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-2xl bg-brown flex-shrink-0 overflow-hidden shadow-gold-sm">
                {song.coverImage ? (
                  <Image src={song.coverImage} alt={song.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-card-gradient flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-gradient">{song.title[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground print:text-black">{song.title}</h1>
                <p className="text-gold print:text-gray-600">Mutsembeki</p>
                {song.category && <span className="badge mt-2 print:hidden">{song.category.name}</span>}
              </div>
            </div>

            {/* Player */}
            {song.audioUrl && (
              <audio src={song.audioUrl} controls className="w-full print:hidden" />
            )}

            {/* Letra */}
            <div className="lyrics-content print:text-black">
              {song.lyrics}
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-6 border-t border-glass-border print:hidden">
              {song.audioUrl && (
                <a href={`/api/downloads/${song.id}`} className="btn-primary gap-2">
                  <Download className="w-4 h-4" />
                  Baixar Música
                </a>
              )}
              <PrintButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
