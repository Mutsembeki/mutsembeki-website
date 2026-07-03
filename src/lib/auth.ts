import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Buscar role do utilizador
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        ;(session.user as any).role = dbUser?.role ?? 'USER'
      }
      return session
    },
    async signIn({ user }) {
      // Promover automaticamente o admin definido na env
      if (user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { role: 'ADMIN' },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
})
