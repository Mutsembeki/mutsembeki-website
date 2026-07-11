import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadImage } from '@/lib/supabase'
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
    // Audio URL vem já como URL do Supabase (upload feito directamente no browser)
    const audioUrl = (formData.get('audioUrl') as string) || null

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    let slug = slugify(title)
    const existing = await prisma.song.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    let coverImage: string | null = null

    if (coverFile && coverFile.size > 0) {
      const result = await uploadImage(coverFile, 'covers')
      coverImage = result.url
    }

    const song = await prisma.song.create({
      data: {
        title, slug, categoryId, albumId,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        youtubeUrl, lyrics, featured, published,
        coverImage, audioUrl,
      },
      include: { category: true, album: true, _count: { select: { downloads: true, views: true } } },
    })

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error('Erro ao criar música:', error)
    return NextResponse.json({ error: 'Erro ao criar música' }, { status: 500 })
  }
}