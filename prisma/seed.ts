import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'louvor' },
      update: {},
      create: { name: 'Louvor', slug: 'louvor', color: '#FFD700' },
    }),
    prisma.category.upsert({
      where: { slug: 'adoracao' },
      update: {},
      create: { name: 'Adoração', slug: 'adoracao', color: '#F4C542' },
    }),
    prisma.category.upsert({
      where: { slug: 'gospel' },
      update: {},
      create: { name: 'Gospel', slug: 'gospel', color: '#D4AF37' },
    }),
    prisma.category.upsert({
      where: { slug: 'pregacao' },
      update: {},
      create: { name: 'Pregação', slug: 'pregacao', color: '#B8860B' },
    }),
  ])

  // Álbum demo
  const album = await prisma.album.upsert({
    where: { slug: 'fe-que-move-montanhas' },
    update: {},
    create: {
      title: 'Fé Que Move Montanhas',
      slug: 'fe-que-move-montanhas',
      description: 'O primeiro álbum oficial de Mutsembeki',
      releaseDate: new Date('2024-01-01'),
    },
  })

  // Músicas demo
  await prisma.song.upsert({
    where: { slug: 'deus-e-fiel' },
    update: {},
    create: {
      title: 'Deus É Fiel',
      slug: 'deus-e-fiel',
      lyrics: `[Verso 1]
Em cada manhã que surge
A Tua fidelidade brilha
Cada promessa cumprida
Testemunho da Tua glória

[Refrão]
Deus é fiel, sempre fiel
Não há poder que Te iguale
A Tua graça me sustenta
E o Teu amor me envolve

[Verso 2]
Nas tormentas da vida
A Tua mão me ampara
Na escuridão mais profunda
A Tua luz sempre brilha`,
      featured: true,
      published: true,
      categoryId: categories[0].id,
      albumId: album.id,
      releaseDate: new Date('2024-01-15'),
    },
  })

  await prisma.song.upsert({
    where: { slug: 'graca-sobre-graca' },
    update: {},
    create: {
      title: 'Graça Sobre Graça',
      slug: 'graca-sobre-graca',
      lyrics: `[Verso 1]
Não mereço o Teu amor
Mas Tu me amastes primeiro
Na cruz do Calvário
Mostraste o Teu cuidado

[Refrão]
Graça sobre graça
Misericórdia sem fim
Teu amor me alcançou
E me transformou assim`,
      featured: true,
      published: true,
      categoryId: categories[1].id,
      albumId: album.id,
      releaseDate: new Date('2024-02-01'),
    },
  })

  await prisma.song.upsert({
    where: { slug: 'glorioso' },
    update: {},
    create: {
      title: 'Glorioso',
      slug: 'glorioso',
      lyrics: `[Verso 1]
Santo, Santo, Santo
É o Senhor dos exércitos
Toda a terra está cheia
Da Tua glória, Senhor

[Refrão]
Glorioso és Tu, Senhor
Glorioso és Tu
Da eternidade à eternidade
O Teu nome é exaltado`,
      featured: false,
      published: true,
      categoryId: categories[2].id,
      albumId: album.id,
      releaseDate: new Date('2024-03-01'),
    },
  })

  // Configurações
  const settingsData = [
    { key: 'site_name', value: 'Mutsembeki - Ministério Musical' },
    { key: 'site_description', value: 'Música que transforma vidas e glorifica a Deus' },
    { key: 'whatsapp', value: '+258 84 000 0000' },
    { key: 'facebook', value: 'https://facebook.com/mutsembeki' },
    { key: 'instagram', value: 'https://instagram.com/mutsembeki' },
    { key: 'youtube', value: 'https://youtube.com/@mutsembeki' },
    { key: 'tiktok', value: 'https://tiktok.com/@mutsembeki' },
    { key: 'email_contact', value: 'contacto@mutsembeki.com' },
  ]

  for (const setting of settingsData) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  // Testemunho demo
  await prisma.testimony.create({
    data: {
      name: 'Maria da Graça',
      city: 'Maputo',
      content: 'As músicas de Mutsembeki mudaram a minha vida. Em um momento muito difícil, a música "Deus É Fiel" me trouxe paz e esperança. Glória a Deus!',
      status: 'APPROVED',
    },
  })

  // Evento demo
  await prisma.event.create({
    data: {
      title: 'Noite de Louvor e Adoração',
      description: 'Uma noite especial de louvor e adoração com Mutsembeki. Venha e experiencie a presença de Deus.',
      location: 'Igreja Central de Maputo, Av. Eduardo Mondlane',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias no futuro
      published: true,
    },
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
