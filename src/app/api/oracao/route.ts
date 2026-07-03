import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPrayerRequestNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, city, request: prayerRequest, isPublic } = body

    if (!name || !prayerRequest) {
      return NextResponse.json({ error: 'Nome e pedido são obrigatórios' }, { status: 400 })
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        name: name.trim(),
        city: city?.trim() || null,
        request: prayerRequest.trim(),
        isPublic: isPublic ?? true,
      },
    })

    // Enviar notificação por email
    try {
      await sendPrayerRequestNotification({
        name: prayer.name,
        city: prayer.city ?? undefined,
        request: prayer.request,
        isPublic: prayer.isPublic,
      })
    } catch (emailError) {
      console.error('Erro ao enviar email de notificação:', emailError)
    }

    return NextResponse.json({ success: true, id: prayer.id })
  } catch (error) {
    console.error('Erro ao criar pedido de oração:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 10

  const prayers = await prisma.prayerRequest.findMany({
    where: { isPublic: true, status: { not: 'ARCHIVED' } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      city: true,
      request: true,
      response: true,
      status: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ prayers })
}
