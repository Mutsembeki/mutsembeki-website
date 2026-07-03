import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-max px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Política de Privacidade</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>Última atualização: {new Date().toLocaleDateString('pt-MZ')}</p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">1. Informações que Recolhemos</h2>
          <p>
            Recolhemos informações que nos fornece directamente, como nome, email e mensagens quando
            preenche formulários de contacto, pedidos de oração, testemunhos ou subscrição da newsletter.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">2. Como Usamos as Suas Informações</h2>
          <p>
            Usamos as informações recolhidas para responder a pedidos de oração, enviar newsletters
            (apenas se subscrito), processar mensagens de contacto e melhorar a experiência do website.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">3. Partilha de Informações</h2>
          <p>
            Não vendemos, alugamos ou partilhamos as suas informações pessoais com terceiros, excepto
            quando exigido por lei ou para proteger os direitos do ministério.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">4. Pedidos de Oração Privados</h2>
          <p>
            Pedidos de oração marcados como &ldquo;privados&rdquo; são visíveis apenas para a administração
            do ministério e não são publicados no website.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">5. Cookies</h2>
          <p>
            O website pode usar cookies essenciais para o seu funcionamento correcto, como manter a sua
            sessão iniciada no painel administrativo.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">6. Os Seus Direitos</h2>
          <p>
            Pode solicitar a remoção dos seus dados pessoais a qualquer momento, incluindo a sua
            subscrição da newsletter, através do email de contacto disponível na página de contacto.
          </p>

          <h2 className="text-foreground font-display text-xl font-semibold mt-8">7. Contacto</h2>
          <p>
            Para questões sobre esta política de privacidade, contacte-nos através da página de contacto do website.
          </p>
        </div>
      </div>
    </div>
  )
}
