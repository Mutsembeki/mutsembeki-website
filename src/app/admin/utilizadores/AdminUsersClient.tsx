'use client'

import { useState } from 'react'
import { Shield, ShieldOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface UserItem {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: Date
}

export function AdminUsersClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState(initialUsers)

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`Alterar o papel deste utilizador para ${newRole}?`)) return

    try {
      const res = await fetch(`/api/admin/utilizadores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: newRole } : u)))
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Utilizadores</h1>
        <p className="text-muted-foreground mt-1">{users.length} utilizadores registados</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Utilizador</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Registado em</th>
              <th className="text-left p-4 text-muted-foreground text-xs uppercase tracking-wider">Papel</th>
              <th className="text-right p-4 text-muted-foreground text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-glass-border last:border-0 hover:bg-glass">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt={user.name ?? ''} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                        <span className="text-background text-xs font-bold">{user.name?.[0] ?? user.email[0]}</span>
                      </div>
                    )}
                    <span className="text-foreground text-sm font-medium">{user.name ?? '—'}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{user.email}</td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(user.createdAt)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-gold/20 text-gold' : 'bg-gray-500/20 text-gray-400'}`}>
                    {user.role === 'ADMIN' ? 'Administrador' : 'Utilizador'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleRole(user.id, user.role)}
                    className="btn-ghost border border-glass-border rounded-lg text-xs gap-1 px-3 py-1.5 inline-flex"
                  >
                    {user.role === 'ADMIN' ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {user.role === 'ADMIN' ? 'Remover Admin' : 'Tornar Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-muted-foreground text-center py-16">Nenhum utilizador registado ainda.</p>}
      </div>
    </div>
  )
}
