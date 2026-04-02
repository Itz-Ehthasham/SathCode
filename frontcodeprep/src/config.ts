/**
 * Base URL for API calls. In dev, leave unset so requests use `/api` and the Vite proxy.
 * For production, set `VITE_API_URL` to your API origin (no trailing slash).
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return ''
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = getApiBaseUrl()
  return base ? `${base}${normalized}` : normalized
}
