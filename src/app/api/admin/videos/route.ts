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
    const { title, youtubeUrl, category, published } = body

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: 'Título e link do YouTube são obrigatórios' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: { title, youtubeUrl, category: category || 'Vídeos Recentes', published: !!published },
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error('Erro ao criar vídeo:', error)
    return NextResponse.json({ error: 'Erro ao criar vídeo' }, { status: 500 })
  }
}
