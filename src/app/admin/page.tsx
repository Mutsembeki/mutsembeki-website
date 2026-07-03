import { prisma } from '@/lib/prisma'
import { Download, Headphones, Music, Users, Heart, MessageSquare, Mail, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { DashboardCharts } from '@/components/admin/DashboardCharts'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    totalDownloads,
    totalViews,
    totalSongs,
    totalSubscribers,
    pendingPrayers,
    pendingTestimonies,
    unreadMessages,
    thisMonthDownloads,
    recentPrayers,
    recentMessages,
    downloadsByMonth,
  ] = await Promise.all([
    prisma.download.count(),
    prisma.view.count(),
    prisma.song.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.prayerRequest.count({ where: { status: 'PENDING' } }),
    prisma.testimony.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.download.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.prayerRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR("createdAt", 'Mon') as month, COUNT(*) as count
      FROM downloads
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR("createdAt", 'Mon'), DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `.catch(() => []),
  ])

  return {
    totalDownloads, totalViews, totalSongs, totalSubscribers,
    pendingPrayers, pendingTestimonies, unreadMessages, thisMonthDownloads,
    recentPrayers, recentMessages,
    downloadsByMonth: downloadsByMonth.map(d => ({ month: d.month, downloads: Number(d.count) })),
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const statCards = [
    { label: 'Downloads Totais', value: data.totalDownloads, icon: Download, color: '#FFD700' },
    { label: 'Reproduções', value: data.totalViews, icon: Headphones, color: '#F4C542' },
    { label: 'Músicas', value: data.totalSongs, icon: Music, color: '#D4AF37' },
    { label: 'Inscritos Newsletter', value: data.totalSubscribers, icon: Users, color: '#B8860B' },
  ]

  const alertCards = [
    { label: 'Pedidos de Oração Pendentes', value: data.pendingPrayers, icon: Heart, href: '/admin/oracao' },
    { label: 'Testemunhos para Aprovar', value: data.pendingTestimonies, icon: MessageSquare, href: '/admin/testemunhos' },
    { label: 'Mensagens Não Lidas', value: data.unreadMessages, icon: Mail, href: '/admin/configuracoes' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do ministério musical</p>
      </div>

      {/* Stats principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-base">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {data.thisMonthDownloads} este mês
              </span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{formatNumber(value)}</p>
            <p className="text-muted-foreground text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <DashboardCharts data={data.downloadsByMonth} />

      {/* Alertas / Itens pendentes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alertCards.map(({ label, value, icon: Icon, href }) => (
          <a key={label} href={href} className="card-base hover:border-gold/30 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
              <Icon className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{value}</p>
              <p className="text-muted-foreground text-sm">{label}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Atividade recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Pedidos de Oração Recentes</h3>
          <div className="space-y-3">
            {data.recentPrayers.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum pedido recente.</p>
            )}
            {data.recentPrayers.map((p) => (
              <div key={p.id} className="flex items-start gap-3 pb-3 border-b border-glass-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-background text-xs font-bold">{p.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs truncate">{p.request}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  p.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {p.status === 'PENDING' ? 'Pendente' : 'Respondido'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-base">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Mensagens Recentes</h3>
          <div className="space-y-3">
            {data.recentMessages.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhuma mensagem recente.</p>
            )}
            {data.recentMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-glass-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-background text-xs font-bold">{m.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium">{m.name}</p>
                  <p className="text-muted-foreground text-xs truncate">{m.subject}</p>
                </div>
                {m.status === 'UNREAD' && <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
