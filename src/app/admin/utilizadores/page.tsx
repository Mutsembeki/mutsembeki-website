import { prisma } from '@/lib/prisma'
import { AdminUsersClient } from './AdminUsersClient'

export const dynamic = 'force-dynamic'

export default async function AdminUtilizadoresPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })

  return <AdminUsersClient initialUsers={users} />
}
