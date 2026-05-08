import { createClient } from '@supabase/supabase-js'

// Lazy client — created at call time, not module load time,
// so Next.js build doesn't fail when env vars aren't inlined yet.
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type FoodEntry = {
  id: string
  created_at: string
  eaten_at: string
  food_name: string
  description: string | null
  calories: number
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  me