import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { TestemunhosClient } from './TestemunhosClient'

export const metadata: Metadata = {
  title: 'Testemunhos',
  description: 'Histórias de transformação e testemunhos de vidas tocadas pela música de Mutsembeki.',
}

export const revalidate = 60

export default async function TestemunhosPage() {
  const testimonies = await prisma.testimony.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  })

  return <TestemunhosClient testimonies={testimonies} />
}
