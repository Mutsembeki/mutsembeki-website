import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Download, Users, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } })
  const activeCount = subscribers.filter(s => s.active).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Newsletter</h1>
          <p className="text-muted-foreground mt-1">{activeCount} inscritos activos de {subscribers.length} totais</p>
        </div>
        <a
          href="/api/admin/newsletter/export"
          className="btn-outline gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Users className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{activeCount}</p>
            <p className="text-muted-foreground text-sm">Inscritos Activos</p>
          </div>
        </div>
        <div className="card-base flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Mail className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">{subscribers.length}</p>
            <p className="text-muted-foreground text-sm">Total de Registos</p>
          </div>
        </div>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Nome</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Data</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id} className="border-b border-glass-border last:border-0 hover:bg-glass">
                <td className="p-4 text-foreground text-sm">{sub.name || '—'}</td>
                <td className="p-4 text-muted-foreground text-sm">{sub.email}</td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(sub.createdAt)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${sub.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {sub.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Nenhum inscrito ainda.</p>
        )}
      </div>
    </div>
  )
}
