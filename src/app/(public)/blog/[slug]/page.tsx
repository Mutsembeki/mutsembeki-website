import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: 'article',
    },
  }
}

export const revalidate = 1800

const categoryLabels: Record<string, string> = {
  REFLEXOES: 'Reflexões',
  DEVOCIONAIS: 'Devocionais',
  MENSAGENS: 'Mensagens',
  NOTICIAS: 'Notícias',
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })

  if (!post) notFound()

  return (
    <div className="min-h-screen pt-24">
      <div className="container-max px-4 md:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Blog
        </Link>

        <article className="max-w-3xl mx-auto">
          <span className="badge mb-4">{categoryLabels[post.category]}</span>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-sm mb-8">{formatDate(post.createdAt)}</p>

          {post.coverImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-brown">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-gold max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed">{post.content}</div>
          </div>
        </article>
      </div>
    </div>
  )
}
