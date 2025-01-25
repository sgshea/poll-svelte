import { env } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)