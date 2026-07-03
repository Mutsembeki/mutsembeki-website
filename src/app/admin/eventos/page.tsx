import { prisma } from '@/lib/prisma'
import { AdminEventsClient } from './AdminEventsClient'

export const dynamic = 'force-dynamic'

export default async function AdminEventosPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'desc' } })
  return <AdminEventsClient initialEvents={events} />
}
