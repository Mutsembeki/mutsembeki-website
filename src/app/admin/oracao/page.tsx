import { prisma } from '@/lib/prisma'
import { AdminPrayerClient } from './AdminPrayerClient'

export const dynamic = 'force-dynamic'

export default async function AdminOracaoPage() {
  const prayers = await prisma.prayerRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <AdminPrayerClient initialPrayers={prayers} />
}
