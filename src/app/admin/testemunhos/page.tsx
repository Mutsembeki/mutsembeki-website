import { prisma } from '@/lib/prisma'
import { AdminTestimoniesClient } from './AdminTestimoniesClient'

export const dynamic = 'force-dynamic'

export default async function AdminTestemunhosPage() {
  const testimonies = await prisma.testimony.findMany({ orderBy: { createdAt: 'desc' } })
  return <AdminTestimoniesClient initialTestimonies={testimonies} />
}
