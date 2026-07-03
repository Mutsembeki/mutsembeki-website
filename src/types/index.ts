export type Role = 'USER' | 'ADMIN'
export type PrayerRequestStatus = 'PENDING' | 'RESPONDED' | 'ARCHIVED'
export type TestimonyStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type BlogCategory = 'REFLEXOES' | 'DEVOCIONAIS' | 'MENSAGENS' | 'NOTICIAS'
export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED'

export interface Song {
  id: string
  title: string
  slug: string
  coverImage: string | null
  audioUrl: string | null
  youtubeUrl: string | null
  lyrics: string | null
  categoryId: string | null
  albumId: string | null
  releaseDate: Date | null
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  category?: Category | null
  album?: Album | null
  _count?: {
    downloads: number
    views: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface Album {
  id: string
  title: string
  slug: string
  coverImage: string | null
  description: string | null
  releaseDate: Date | null
}

export interface PrayerRequest {
  id: string
  name: string
  city: string | null
  request: string
  isPublic: boolean
  status: PrayerRequestStatus
  response: string | null
  createdAt: Date
}

export interface Testimony {
  id: string
  name: string
  city: string | null
  content: string
  status: TestimonyStatus
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: BlogCategory
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  mapUrl: string | null
  date: Date
  imageUrl: string | null
  published: boolean
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  active: boolean
  createdAt: Date
}

export interface DashboardStats {
  totalDownloads: number
  totalViews: number
  totalSongs: number
  totalSubscribers: number
  pendingPrayers: number
  pendingTestimonies: number
  unreadMessages: number
  thisMonthDownloads: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
