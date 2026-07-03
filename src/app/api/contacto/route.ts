import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message },
    })

    try {
      await sendContactEmail({ name, email, phone, subject, message })
    } catch (emailError) {
      console.error('Erro ao enviar email de contacto:', emailError)
    }

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Erro ao salvar contacto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
