'use client'

import { useState } from 'react'
import { Save, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: Date
}

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>
  messages: ContactMessage[]
}

const settingsFields = [
  { key: 'site_name', label: 'Nome do Site' },
  { key: 'site_description', label: 'Descrição do Site' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'youtube', label: 'YouTube URL' },
  { key: 'tiktok', label: 'TikTok URL' },
  { key: 'email_contact', label: 'Email de Contacto' },
]

export function AdminSettingsClient({ initialSettings, messages }: AdminSettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {}
    finally { setIsSaving(false) }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerir informações gerais do site</p>
      </div>

      <div className="card-base space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsFields.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-foreground">{label}</label>
              <input
                value={settings[key] ?? ''}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                className="input-base"
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Configurações'}
        </button>
      </div>

      <div className="card-base space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Mail className="w-5 h-5 text-gold" />
          Mensagens de Contacto Recentes
        </h2>
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="bg-glass rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium text-sm">{m.name} — {m.subject}</p>
                <span className="text-muted-foreground text-xs">{formatDate(m.createdAt)}</span>
              </div>
              <p className="text-muted-foreground text-sm">{m.message}</p>
              <a href={`mailto:${m.email}`} className="text-gold text-xs hover:underline">{m.email}</a>
            </div>
          ))}
          {messages.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma mensagem recebida ainda.</p>}
        </div>
      </div>
    </div>
  )
}
