import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, city, content } = body

    if (!name || !content) {
      return NextResponse.json({ error: 'Nome e testemunho são obrigatórios' }, { status: 400 })
    }

    const testimony = await prisma.testimony.create({
      data: {
        name: name.trim(),
        city: city?.trim() || null,
        content: content.trim(),
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, id: testimony.id })
  } catch (error) {
    console.error('Erro ao criar testemunho:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
