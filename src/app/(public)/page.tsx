import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturedSongs } from '@/components/sections/FeaturedSongs'
import { StatsSection } from '@/components/sections/StatsSection'
import {
  AboutSection,
  PrayerCTA,
  TestimoniesSection,
  EventsSection,
  NewsletterSection,
} from '@/components/sections/AboutSection'

export const metadata: Metadata = {
  title: 'Mutsembeki — Ministério Musical Gospel',
  description: 'Ouça, baixe e seja abençoado pelas músicas de Mutsembeki. Música gospel que transforma vidas.',
}

export const revalidate = 3600

async function getSubscriberCount() {
  try {
    return await prisma.newsletterSubscriber.count()
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const [featuredSongs, testimonies, upcomingEvents] = await Promise.all([
    prisma.song.findMany({
      where: { featured: true, published: true },
      include: { category: true, _count: { select: { downloads: true, views: true } } },
      orderBy: { releaseDate: 'desc' },
      take: 6,
    }),
    prisma.testimony.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 3,
    }),
  ])

  const [totalDownloads, totalViews, totalSongs] = await Promise.all([
    prisma.download.count(),
    prisma.view.count(),
    prisma.song.count({ where: { published: true } }),
  ])

  const subscribers = await getSubscriberCount()

  return (
    <>
      <HeroSection />
      <StatsSection
        downloads={totalDownloads}
        views={totalViews}
        songs={totalSongs}
        subscribers={subscribers}
      />
      <FeaturedSongs songs={featuredSongs} />
      <AboutSection />
      <PrayerCTA />
      <TestimoniesSection testimonies={testimonies} />
      <EventsSection events={upcomingEvents} />
      <NewsletterSection />
    </>
  )
}