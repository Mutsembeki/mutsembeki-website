import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage, uploadAudio } from '@/lib/supabase'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return null
  }
  return session
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params

  try {
    const formData = await request.formData()

    const title = formData.get('title') as string
    const categoryId = (formData.get('categoryId') as string) || null
    const albumId = (formData.get('albumId') as string) || null
    const releaseDate = formData.get('releaseDate') as string
    const youtubeUrl = (formData.get('youtubeUrl') as string) || null
    const lyrics = (formData.get('lyrics') as string) || null
    const featured = formData.get('featured') === 'on'
    const published = formData.get('published') === 'on'
    const coverFile = formData.get('cover') as File | null
    const audioFile = formData.get('audio') as File | null

    const updateData: Record<string, unknown> = {
      title,
      categoryId,
      albumId,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      youtubeUrl,
      lyrics,
      featured,
      published,
    }

    if (coverFile && coverFile.size > 0) {
      const result = await uploadImage(coverFile, 'mutsembeki/covers')
      updateData.coverImage = result.url
    }

    if (audioFile && audioFile.size > 0) {
      const result = await uploadAudio(audioFile, 'mutsembeki/audio')
      updateData.audioUrl = result.url
    }

    const song = await prisma.song.update({
      where: { id },
      data: updateData,
      include: { category: true, album: true, _count: { select: { downloads: true, views: true } } },
    })

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error('Erro ao atualizar música:', error)
    return NextResponse.json({ error: 'Erro ao atualizar música' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params

  try {
    await prisma.song.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir música:', error)
    return NextResponse.json({ error: 'Erro ao excluir música' }, { status: 500 })
  }
}
