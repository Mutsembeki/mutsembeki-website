import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const song = await prisma.song.findUnique({
      where: { id, published: true },
    })

    if (!song) {
      return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 })
    }

    if (!song.audioUrl) {
      return NextResponse.json({ error: 'Áudio não disponível' }, { status: 404 })
    }

    await prisma.download.create({
      data: {
        songId: song.id,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') ?? undefined,
      },
    })

    const audioResponse = await fetch(song.audioUrl)

    if (!audioResponse.ok) {
      return NextResponse.json({ error: 'Erro ao buscar áudio' }, { status: 500 })
    }

    const audioBuffer = await audioResponse.arrayBuffer()

    const cleanTitle = song.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.mp3$/i, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const filename = `${cleanTitle}.mp3`

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Erro no download:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}