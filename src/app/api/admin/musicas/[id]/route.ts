import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()

  if (!session) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    )
  }

  const { id } = await params

  try {
    const body = await request.json()

    const {
      title,
      categoryId,
      albumId,
      releaseDate,
      youtubeUrl,
      lyrics,
      featured,
      published,
      coverImage,
      audioUrl,
    } = body

    const song = await prisma.song.update({
      where: { id },
      data: {
        title,
        categoryId: categoryId || null,
        albumId: albumId || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        youtubeUrl: youtubeUrl || null,
        lyrics: lyrics || null,
        featured: Boolean(featured),
        published: Boolean(published),
        coverImage: coverImage || null,
        audioUrl: audioUrl || null,
      },
      include: {
        category: true,
        album: true,
        _count: {
          select: {
            downloads: true,
            views: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      song,
    })
  } catch (error) {
    console.error('Erro ao atualizar música:', error)

    return NextResponse.json(
      { error: 'Erro ao atualizar música' },
      { status: 500 }
    )
  }
}