import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function requireAdmin() {
    const session = await auth()

    if (!session?.user?.email) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    })

    if (!user || user.role !== 'ADMIN') {
        return null
    }

    return user
}