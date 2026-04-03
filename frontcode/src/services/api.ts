import { apiUrl } from '../config'

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path)
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: { ...defaultHeaders, ...init?.headers },
  })
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
