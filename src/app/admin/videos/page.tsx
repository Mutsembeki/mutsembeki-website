import { prisma } from '@/lib/prisma'
import { AdminVideosClient } from './AdminVideosClient'

export const dynamic = 'force-dynamic'

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } })
  return <AdminVideosClient initialVideos={videos} />
}
