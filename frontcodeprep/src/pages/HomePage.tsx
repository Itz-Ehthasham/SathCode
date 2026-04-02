import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'

type HealthResponse = {
  ok: boolean
  service: string
  time: string
}

export function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiGet<HealthResponse>('/api/health')
      .then((data) => {
        if (!cancelled) {
          setHealth(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setHealth(null)
          setError(err instanceof Error ? err.message : 'Could not reach API')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg text-center space-y-4">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          CodingPrep
        </p>
        <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
          AI-powered coding preparation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn smarter with guided practice
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Tailwind is configured. The home page loads{' '}
          <code className="rounded bg-neutral-200/80 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            GET /api/health
          </code>{' '}
          via the Vite proxy in development.
        </p>
        <div
          className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-sm dark:border-neutral-800 dark:bg-neutral-900"
          aria-live="polite"
        >
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            Backend
          </p>
          {!health && !error && (
            <p className="mt-1 text-neutral-500">Checking API…</p>
          )}
          {error && (
            <p className="mt-1 text-red-600 dark:text-red-400">{error}</p>
          )}
          {health && (
            <ul className="mt-2 space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>
                <span className="text-neutral-500">Service:</span>{' '}
                {health.service}
              </li>
              <li>
                <span className="text-neutral-500">Time:</span> {health.time}
              </li>
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
