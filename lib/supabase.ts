import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_BASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY

console.log(supabaseUrl)
console.log(supabaseAnonKey)

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})