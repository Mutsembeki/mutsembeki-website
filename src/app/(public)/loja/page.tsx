import type { Metadata } from 'next'
import { ShoppingBag, Disc3, Shirt, BookOpen, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Loja',
  description: 'Loja digital de Mutsembeki — álbuns, merchandising e materiais (em breve).',
}

const categories = [
  { icon: Disc3, label: 'Álbuns Digitais', desc: 'Compre os álbuns completos em alta qualidade' },
  { icon: Shirt, label: 'Merchandising', desc: 'T-shirts, bonés e acessórios oficiais' },
  { icon: BookOpen, label: 'Livros', desc: 'Materiais de estudo e devocionais escritos' },
  { icon: Sparkles, label: 'Materiais Digitais', desc: 'Partituras, playbacks e recursos para igrejas' },
]

export default function LojaPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16 text-center">
          <span className="badge">Em Breve</span>
          <h1 className="section-title mt-4">Loja Digital</h1>
          <div className="gold-divider mt-4 mx-auto" />
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Estamos a preparar uma loja completa para que possa apoiar o ministério e adquirir
            álbuns, merchandising e materiais exclusivos.
          </p>
        </div>
      </div>

      <div className="container-max px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-base text-center space-y-4 opacity-80">
              <div className="w-14 h-14 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-sm">
                <Icon className="w-7 h-7 text-background" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{label}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
              <span className="badge">Em Breve</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Quer ser notificado quando a loja abrir? <a href="/#newsletter" className="text-gold hover:underline">Inscreva-se na newsletter</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
