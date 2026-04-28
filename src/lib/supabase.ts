import { createClient } from '@supabase/supabase-js'

// Usando strings vazias provisoriamente caso o .env não exista ainda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://url-falsa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'chave-falsa'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
