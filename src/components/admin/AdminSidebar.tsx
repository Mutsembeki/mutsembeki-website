'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Music, Video, Heart, Mail, Users,
  Settings, LogOut, BookOpen, Calendar, MessageSquare, Music2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/musicas', icon: Music, label: 'Músicas' },
  { href: '/admin/videos', icon: Video, label: 'Vídeos' },
  { href: '/admin/oracao', icon: Heart, label: 'Pedidos de Oração' },
  { href: '/admin/testemunhos', icon: MessageSquare, label: 'Testemunhos' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { href: '/admin/eventos', icon: Calendar, label: 'Eventos' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/utilizadores', icon: Users, label: 'Utilizadores' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
]

interface AdminSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-glass-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-glass-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <Music2 className="w-4 h-4 text-background" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-gradient">MUTSEMBEKI</p>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gold text-background shadow-gold-sm'
                  : 'text-muted-foreground hover:text-gold hover:bg-glass'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Perfil + logout */}
      <div className="p-4 border-t border-glass-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          {user.image ? (
            <img src={user.image} alt={user.name ?? ''} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-background text-xs font-bold">{user.name?.[0] ?? 'A'}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-foreground text-sm font-medium truncate">{user.name ?? 'Admin'}</p>
            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Terminar Sessão
        </button>
      </div>
    </aside>
  )
}
