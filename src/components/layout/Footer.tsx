import Link from 'next/link'
import { Music, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const footerLinks = {
  ministerio: [
    { href: '/sobre', label: 'Sobre Mutsembeki' },
    { href: '/musicas', label: 'Músicas' },
    { href: '/videos', label: 'Vídeos' },
    { href: '/eventos', label: 'Eventos' },
    { href: '/blog', label: 'Blog' },
  ],
  comunidade: [
    { href: '/oracao', label: 'Pedidos de Oração' },
    { href: '/testemunhos', label: 'Testemunhos' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/loja', label: 'Loja' },
  ],
  legal: [
    { href: '/privacidade', label: 'Política de Privacidade' },
    { href: '/termos', label: 'Termos de Uso' },
  ],
}

const socials = [
  { href: 'https://facebook.com/mutsembeki', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com/mutsembeki', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com/@mutsembeki', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-brown-dark/50">
      <div className="container-max px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                <Music className="w-4 h-4 text-background" />
              </div>
              <span className="font-display text-xl font-bold text-gradient">MUTSEMBEKI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Música que transforma vidas e glorifica a Deus. Ministério dedicado à evangelização através do louvor e adoração.
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Ministério */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Ministério</h3>
            <ul className="space-y-3">
              {footerLinks.ministerio.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Comunidade</h3>
            <ul className="space-y-3">
              {footerLinks.comunidade.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Receba novos lançamentos e devocionais no seu email.
            </p>
            <form action="/api/newsletter" method="POST" className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Seu email"
                required
                className="input-base text-sm"
              />
              <button type="submit" className="btn-primary w-full text-sm py-2.5">
                Subscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mutsembeki. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground text-xs hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
