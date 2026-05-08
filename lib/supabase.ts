import { createClient } from '@supabase/supabase-js'

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
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
  image_url: string | null
}
