'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline gap-2">
      <Printer className="w-4 h-4" />
      Imprimir Letra
    </button>
  )
}
