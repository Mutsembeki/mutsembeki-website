import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Reflexões, devocionais, mensagens e notícias do ministério Mutsembeki.',
}

export const revalidate = 1800

const categoryLabels: Record<string, string> = {
  REFLEXOES: 'Reflexões',
  DEVOCIONAIS: 'Devocionais',
  MENSAGENS: 'Mensagens',
  NOTICIAS: 'Notícias',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <span className="badge">Blog Cristão</span>
          <h1 className="section-title mt-4">Reflexões & Devocionais</h1>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-base group hover:border-gold/30 hover:shadow-gold-sm transition-all">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-brown">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-card-gradient flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gold opacity-50" />
                  </div>
                )}
              </div>
              <span className="badge mb-2">{categoryLabels[post.category]}</span>
              <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.excerpt && <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{post.excerpt}</p>}
              <p className="text-muted-foreground text-xs mt-4">{formatDate(post.createdAt)}</p>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Nenhum artigo publicado ainda.</p>
        )}
      </div>
    </div>
  )
}
