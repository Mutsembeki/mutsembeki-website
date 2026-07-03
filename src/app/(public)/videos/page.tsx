import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { VideosClient } from './VideosClient'

export const metadata: Metadata = {
  title: 'Vídeos',
  description: 'Assista vídeos, pregações e testemunhos de Mutsembeki.',
}

export const revalidate = 1800

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return <VideosClient videos={videos} />
}
