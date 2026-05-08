import { getSupabase, FoodEntry } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default async function HistoryPage() {
  const supabase = getSupabase()
  const { data: entries, error } = await supabase
    .from('food_entries')
    .select('*')
    .order('eaten_at', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(200)

  if (error) {
    return <p className="text-red-400">Failed to load history: {error.message}</p>
  }

  const byDate: Record<string, FoodEntry[]> = {}
  for (const entry of (entries ?? [])) {
    if (!byDate[entry.eaten_at]) byDate[entry.eaten_at] = []
    byDate[entry.eaten_at].push(entry)
  }

  const dates = Object.keys(byDate)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-zinc-500 text-sm mt-1">All logged meals</p>
      </div>

      {dates.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-lg">No history yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {dates.map(date => {
            const dayEntries = byDate[date]
            const total = dayEntries.reduce((s, e) => s + e.calories, 0)
            return (
              <div key={date}>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-semibold text-zinc-200">{formatDate(date)}</h2>
                  <span className="text-orange-400 font-semibold text-sm">{total.toLocaleString()} kcal</span>
                </div>
                <div className="space-y-2">
                  {dayEntries.map((entry: FoodEntry) => (
                    <div key={entry.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {entry.meal_type && (
                            <span className="text-xs uppercase text-zinc-500 font-medium">{entry.meal_type}</span>
                          )}
                          <p className="font-medium truncate">{entry.food_name}</p>
                        </div>
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
                        <span className="text-orange-400 font-semibold">{entry.calories}</span>
                        <span className="text-zinc-600 text-sm ml-1">kcal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
