import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  const csvHeader = 'Nome,Email,Data de Inscrição\n'
  const csvRows = subscribers
    .map(s => `"${s.name || ''}","${s.email}","${s.createdAt.toISOString().split('T')[0]}"`)
    .join('\n')

  const csv = csvHeader + csvRows

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter-mutsembeki.csv"',
    },
  })
}
