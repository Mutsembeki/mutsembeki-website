import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-max px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Termos de Uso</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>Última atualização: {new Date().toLocaleDateString('pt-MZ')}</p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">1. Aceitação dos Termos</h2>
          <p>
            Ao aceder e usar este website, concorda em cumprir estes Termos de Uso. Se não concorda
            com algum destes termos, pedimos que não utilize o website.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">2. Uso do Conteúdo</h2>
          <p>
            Todo o conteúdo musical, letras, vídeos e materiais disponibilizados neste website são
            propriedade de Mutsembeki e protegidos por direitos de autor. O download é permitido
            apenas para uso pessoal e não comercial.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">3. Conduta do Utilizador</h2>
          <p>
            Ao submeter testemunhos, comentários ou pedidos de oração, compromete-se a fornecer
            informações verdadeiras e a manter uma conduta respeitosa e cristã.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">4. Conteúdo Submetido</h2>
          <p>
            Testemunhos e comentários submetidos podem ser moderados e publicados a critério da
            administração do ministério.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">5. Limitação de Responsabilidade</h2>
          <p>
            O website é fornecido &ldquo;tal como está&rdquo;. Não garantimos disponibilidade ininterrupta
            ou ausência total de erros.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">6. Alterações aos Termos</h2>
          <p>
            Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram
            em vigor a partir da sua publicação nesta página.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">7. Contacto</h2>
          <p>
            Para dúvidas sobre estes termos, contacte-nos através da página de contacto.
          </p>
        </div>
      </div>
    </div>
  )
}
