import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const songs = await prisma.song.findMany({
    include: { category: true, album: true, _count: { select: { downloads: true, views: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ songs })
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const body = await request.json()

    const {
      title, categoryId, albumId, releaseDate,
      youtubeUrl, lyrics, featured, published,
      coverImage, audioUrl,
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    let slug = slugify(title)
    const existing = await prisma.song.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const song = await prisma.song.create({
      data: {
        title,
        slug,
        categoryId: categoryId || null,
        albumId: albumId || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        youtubeUrl: youtubeUrl || null,
        lyrics: lyrics || null,
        featured: !!featured,
        published: !!published,
        coverImage: coverImage || null,
        audioUrl: audioUrl || null,
      },
      include: { category: true, album: true, _count: { select: { downloads: true, views: true } } },
    })

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error('Erro ao criar música:', error)
    return NextResponse.json({ error: 'Erro ao criar música' }, { status: 500 })
  }
}