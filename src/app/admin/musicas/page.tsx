import { prisma } from '@/lib/prisma'
import { AdminSongsClient } from './AdminSongsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSongsPage() {
  const [songs, categories, albums] = await Promise.all([
    prisma.song.findMany({
      include: { category: true, album: true, _count: { select: { downloads: true, views: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.album.findMany({ orderBy: { title: 'asc' } }),
  ])

  return <AdminSongsClient initialSongs={songs} categories={categories} albums={albums} />
}
