import { getSupabase, FoodEntry } from '@/lib/supabase'

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_LABEL: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export const dynamic = 'force-dynamic'

export default async function TodayPage() {
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  const { data: entries, error } = await supabase
    .from('food_entries')
    .select('*')
    .eq('eaten_at', today)
    .order('created_at', { ascending: true })

  if (error) {
    return <p className="text-red-400">Failed to load entries: {error.message}</p>
  }

  const totalCalories = entries?.reduce((sum, e) => sum + (e.calories ?? 0), 0) ?? 0
  const totalProtein  = entries?.reduce((sum, e) => sum + (e.protein_g ?? 0), 0) ?? 0
  const totalCarbs    = entries?.reduce((sum, e) => sum + (e.carbs_g ?? 0), 0) ?? 0
  const totalFat      = entries?.reduce((sum, e) => sum + (e.fat_g ?? 0), 0) ?? 0

  const byMeal: Record<string, FoodEntry[]> = {}
  for (const entry of (entries ?? [])) {
    const key = entry.meal_type ?? 'snack'
    if (!byMeal[key]) byMeal[key] = []
    byMeal[key].push(entry)
  }

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <div>
        <p className="text-zinc-500 text-sm mb-1">{todayLabel}</p>
        <h1 className="text-3xl font-bold">Today&apos;s Log</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 col-span-2">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Calories</p>
          <p className="text-4xl font-bold text-orange-400">{totalCalories.toLocaleString()}</p>
          <p className="text-zinc-600 text-xs mt-1">kcal today</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Protein</p>
          <p className="text-2xl font-semibold text-blue-400">{Math.round(totalProtein)}g</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Carbs</p>
          <p className="text-2xl font-semibold text-green-400">{Math.round(totalCarbs)}g</p>
        </div>
      </div>

      {entries && entries.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-lg">No entries yet today.</p>
          <p className="text-sm mt-1">Send a photo to Claude to log your first meal.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {MEAL_ORDER.filter(m => byMeal[m]).map(meal => (
            <div key={meal}>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                <span>{MEAL_LABEL[meal]}</span>
                <span className="text-zinc-600 normal-case tracking-normal font-normal">
                  &middot; {byMeal[meal].reduce((s, e) => s + e.calories, 0)} kcal
                </span>
              </h2>
              <div className="space-y-2">
                {byMeal[meal].map((entry: FoodEntry) => (
                  <div key={entry.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{entry.food_name}</p>
                      {entry.description && (
                        <p className="text-zinc-500 text-sm truncate mt-0.5">{entry.description}</p>
                      )}
                      {(entry.protein_g || entry.carbs_g || entry.fat_g) && (
                        <p className="text-xs text-zinc-600 mt-1">
                          P {Math.round(entry.protein_g ?? 0)}g &middot; C {Math.round(entry.carbs_g ?? 0)}g &middot; F {Math.round(entry.fat_g ?? 0)}g
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-orange-400 font-semibold text-lg">{entry.calories}</span>
                      <span className="text-zinc-600 text-sm ml-1">kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries && entries.length > 0 && (
        <div className="border-t border-zinc-800 pt-4 flex justify-between text-sm text-zinc-500">
          <span>{entries.length} item{entries.length !== 1 ? 's' : ''}</span>
          <span>Fat: {Math.round(totalFat)}g</span>
        </div>
      )}
    </div>
  )
}
