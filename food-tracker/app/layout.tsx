import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BiteLog',
  description: 'Personal calorie tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        <nav className="border-b border-zinc-800 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              🍽️ <span className="text-orange-400">Bite</span>Log
            </a>
            <div className="flex gap-6 text-sm text-zinc-400">
              <a href="/" className="hover:text-zinc-100 transition-colors">Today</a>
              <a href="/history" className="hover:text-zinc-100 transition-colors">History</a>
            </div>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
