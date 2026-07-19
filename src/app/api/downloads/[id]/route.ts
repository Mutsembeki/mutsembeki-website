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
      where: {
        id,
        published: true,
      },
    })

    if (!song) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      )
    }

    if (!song.audioUrl) {
      return NextResponse.json(
        { error: 'Áudio não disponível' },
        { status: 404 }
      )
    }

    // Registar download
    await prisma.download.create({
      data: {
        songId: song.id,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent') ?? undefined,
      },
    })

    // Buscar ficheiro do Storage
    const response = await fetch(song.audioUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao obter o áudio' },
        { status: 500 }
      )
    }

    const audioBuffer = await response.arrayBuffer()

    // LOGS PARA DEBUG
    console.log('==============================')
    console.log('Título BD:', song.title)
    console.log('Audio URL:', song.audioUrl)
    console.log('==============================')

    // Limpar nome
    const cleanTitle = song.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.mp3$/i, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const filename = `${cleanTitle}.mp3`

    console.log('Nome enviado ao navegador:', filename)

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Erro no download:', error)

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}