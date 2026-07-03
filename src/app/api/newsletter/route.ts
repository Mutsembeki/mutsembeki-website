import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterWelcome } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    let email: string, name: string | undefined

    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      email = body.email
      name = body.name
    } else {
      const formData = await request.formData()
      email = formData.get('email') as string
      name = formData.get('name') as string
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true, name: name || existing.name },
        })
        return NextResponse.json({ success: true, message: 'Subscrição reativada!' })
      }
      return NextResponse.json({ success: true, message: 'Já está inscrito!' })
    }

    await prisma.newsletterSubscriber.create({
      data: { email, name: name || null },
    })

    // Email de boas-vindas
    try {
      await sendNewsletterWelcome({ email, name })
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError)
    }

    // Redirect para formulários HTML normais
    const referer = request.headers.get('referer') ?? '/'
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL(`${referer}?subscribed=true`, request.url))
    }

    return NextResponse.json({ success: true, message: 'Inscrito com sucesso!' })
  } catch (error) {
    console.error('Erro na newsletter:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
