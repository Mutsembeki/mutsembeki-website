import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { AboutPageContent } from './AboutPageContent'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a biografia, testemunho e chamado ministerial de Mutsembeki.',
}

export default function SobrePage() {
  return <AboutPageContent />
}
