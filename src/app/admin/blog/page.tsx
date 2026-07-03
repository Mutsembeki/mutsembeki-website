import { prisma } from '@/lib/prisma'
import { AdminBlogClient } from './AdminBlogClient'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return <AdminBlogClient initialPosts={posts} />
}
