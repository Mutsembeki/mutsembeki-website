import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await request.json()
    const { title, date, location, mapUrl, description } = body

    if (!title || !date) {
      return NextResponse.json({ error: 'Título e data são obrigatórios' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location: location || null,
        mapUrl: mapUrl || null,
        description: description || null,
        published: true,
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}
