import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { MusicasClient } from './MusicasClient'

export const metadata: Metadata = {
  title: 'Músicas',
  description: 'Ouça e baixe todas as músicas de Mutsembeki. Louvor e adoração gospel.',
}

export const revalidate = 1800

export default async function MusicasPage() {
  const [songs, categories, albums] = await Promise.all([
    prisma.song.findMany({
      where: { published: true },
      include: {
        category: true,
        album: true,
        _count: { select: { downloads: true, views: true } },
      },
      orderBy: { releaseDate: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.album.findMany({ orderBy: { releaseDate: 'desc' } }),
  ])

  return <MusicasClient songs={songs} categories={categories} albums={albums} />
}
