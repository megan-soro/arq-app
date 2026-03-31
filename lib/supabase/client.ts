import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let instance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (instance) {
    return instance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  instance = createSupabaseClient(url, key)
  return instance
}
