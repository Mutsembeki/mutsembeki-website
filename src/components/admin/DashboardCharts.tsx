'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardChartsProps {
  data: { month: string; downloads: number }[]
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', downloads: 0 },
    { month: 'Fev', downloads: 0 },
    { month: 'Mar', downloads: 0 },
  ]

  return (
    <div className="card-base">
      <h3 className="font-display text-lg font-semibold text-foreground mb-6">Downloads — Últimos 6 Meses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.1)" />
          <XAxis dataKey="month" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#0D0D0D',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Area type="monotone" dataKey="downloads" stroke="#FFD700" strokeWidth={2} fill="url(#goldGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
