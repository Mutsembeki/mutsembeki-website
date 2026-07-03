import { prisma } from '@/lib/prisma'
import { AdminSettingsClient } from './AdminSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminConfiguracoesPage() {
  const settings = await prisma.settings.findMany()
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })

  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, string>)

  return <AdminSettingsClient initialSettings={settingsMap} messages={messages} />
}
