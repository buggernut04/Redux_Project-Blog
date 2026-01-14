import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wainquctyqkkswprxmow.supabase.co'
// 💡 Access using import.meta.env
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Your type-safe check from before (highly recommended)
if (!supabaseKey) {
  throw new Error("VITE_SUPABASE_KEY is not set in your .env file.")
}

export const supabase = createClient(
    supabaseUrl, supabaseKey
)