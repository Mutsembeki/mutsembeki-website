import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  return resend.emails.send({
    from: 'Mutsembeki Website <noreply@mutsembeki.com>',
    to: [process.env.ADMIN_EMAIL!],
    replyTo: email,
    subject: `[Contacto] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D0D; color: #fff; padding: 32px; border-radius: 12px; border: 1px solid rgba(255,215,0,0.2);">
        <h2 style="color: #FFD700; margin-bottom: 24px;">Nova Mensagem de Contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888;">Nome:</td><td style="padding: 8px 0; color: #fff;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0; color: #FFD700;"><a href="mailto:${email}" style="color: #FFD700;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Telefone:</td><td style="padding: 8px 0; color: #fff;">${phone}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #888;">Assunto:</td><td style="padding: 8px 0; color: #fff;">${subject}</td></tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: rgba(255,215,0,0.05); border-radius: 8px; border-left: 3px solid #FFD700;">
          <p style="color: #888; margin: 0 0 8px;">Mensagem:</p>
          <p style="color: #fff; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  })
}

export async function sendNewsletterWelcome({ name, email }: { name?: string; email: string }) {
  return resend.emails.send({
    from: 'Mutsembeki <newsletter@mutsembeki.com>',
    to: [email],
    subject: 'Bem-vindo à comunidade Mutsembeki! 🙏',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D0D; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #FFD700; text-align: center;">Mutsembeki</h1>
        <h2 style="color: #fff; text-align: center;">Bem-vindo, ${name || 'amigo'}! 🙌</h2>
        <p style="color: #ccc; text-align: center; line-height: 1.8;">
          Obrigado por se juntar à nossa comunidade. A partir de agora, receberá
          os nossos novos lançamentos, devocionais e notícias do ministério.
        </p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXTAUTH_URL}" style="background: #FFD700; color: #050505; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Visitar o Website
          </a>
        </div>
        <p style="color: #555; text-align: center; margin-top: 32px; font-size: 12px;">
          Para cancelar a subscrição, responda a este email com "Cancelar".
        </p>
      </div>
    `,
  })
}

export async function sendPrayerRequestNotification({
  name,
  city,
  request,
  isPublic,
}: {
  name: string
  city?: string
  request: string
  isPublic: boolean
}) {
  return resend.emails.send({
    from: 'Mutsembeki <noreply@mutsembeki.com>',
    to: [process.env.ADMIN_EMAIL!],
    subject: `[Pedido de Oração] ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D0D; color: #fff; padding: 32px; border-radius: 12px;">
        <h2 style="color: #FFD700;">Novo Pedido de Oração</h2>
        <p><strong style="color: #888;">De:</strong> ${name} ${city ? `(${city})` : ''}</p>
        <p><strong style="color: #888;">Visibilidade:</strong> ${isPublic ? 'Público' : 'Privado'}</p>
        <div style="margin-top: 16px; padding: 16px; background: rgba(255,215,0,0.05); border-radius: 8px; border-left: 3px solid #FFD700;">
          <p style="color: #fff; white-space: pre-wrap;">${request}</p>
        </div>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/admin/oracao" style="background: #FFD700; color: #050505; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Ver no Painel Admin
          </a>
        </div>
      </div>
    `,
  })
}
