import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// 💡 Access using import.meta.env
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Your type-safe check from before (highly recommended)
if (!supabaseKey) {
  throw new Error("VITE_SUPABASE_KEY is not set in your .env file.")
}

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not set in your .env file.")
}

export const supabase = createClient(
    supabaseUrl, supabaseKey
)