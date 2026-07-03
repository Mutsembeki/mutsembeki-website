import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

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
    const { title, category, excerpt, coverImage, content, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 })
    }

    let slug = slugify(title)
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category: category || 'REFLEXOES',
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        content,
        published: !!published,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Erro ao criar artigo:', error)
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 })
  }
}
