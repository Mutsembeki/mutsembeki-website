import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente admin (usado apenas no servidor, nunca exposto ao browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const COVERS_BUCKET = 'covers'
const AUDIO_BUCKET = 'audio'

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
}

export async function uploadImage(file: File, folder: string = 'covers') {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`

  const { error } = await supabaseAdmin.storage
    .from(COVERS_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const { data } = supabaseAdmin.storage.from(COVERS_BUCKET).getPublicUrl(fileName)

  return { url: data.publicUrl, path: fileName }
}

export async function uploadAudio(file: File, folder: string = 'audio') {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`

  const { error } = await supabaseAdmin.storage
    .from(AUDIO_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type || 'audio/mpeg',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabaseAdmin.storage.from(AUDIO_BUCKET).getPublicUrl(fileName)

  return { url: data.publicUrl, path: fileName }
}

export async function deleteFile(path: string, bucket: 'covers' | 'audio' = 'covers') {
  return supabaseAdmin.storage.from(bucket).remove([path])
}
