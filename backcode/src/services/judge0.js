/**
 * Judge0 CE client. Configure via env:
 * - JUDGE0_API_URL — base URL (default https://ce.judge0.com)
 * - JUDGE0_RAPIDAPI_KEY + JUDGE0_RAPIDAPI_HOST — RapidAPI Judge0 CE (optional)
 * - JUDGE0_AUTH_TOKEN — Bearer token for self-hosted instances (optional)
 */

function getBaseUrl() {
  const url = process.env.JUDGE0_API_URL || 'https://ce.judge0.com'
  return url.replace(/\/$/, '')
}

function buildHeaders(includeJsonContentType = false) {
  const headers = { Accept: 'application/json' }
  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json'
  }

  const rapidKey = process.env.JUDGE0_RAPIDAPI_KEY
  const rapidHost =
    process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com'
  if (rapidKey) {
    headers['X-RapidAPI-Key'] = rapidKey
    headers['X-RapidAPI-Host'] = rapidHost
  }

  const token = process.env.JUDGE0_AUTH_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

/**
 * @param {object} opts
 * @param {string} opts.source_code
 * @param {number} opts.language_id
 * @param {string} [opts.stdin]
 * @param {boolean} [opts.wait=true] — wait for result on create (single round-trip)
 */
async function createSubmission({
  source_code,
  language_id,
  stdin = '',
  wait = true,
}) {
  const base = getBaseUrl()
  const params = new URLSearchParams({
    base64_encoded: 'false',
    wait: wait ? 'true' : 'false',
  })

  const res = await fetch(`${base}/submissions?${params}`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({
      source_code,
      language_id: Number(language_id),
      stdin: stdin ?? '',
    }),
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Judge0 ${res.status}: ${text.slice(0, 500)}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Judge0 returned non-JSON response')
  }
}

/**
 * Poll submission by token when wait=false was used.
 * @param {string} token
 */
async function getSubmission(token) {
  const base = getBaseUrl()
  const params = new URLSearchParams({ base64_encoded: 'false' })
  const res = await fetch(`${base}/submissions/${encodeURIComponent(token)}?${params}`, {
    headers: buildHeaders(false),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Judge0 ${res.status}: ${text.slice(0, 500)}`)
  }
  return JSON.parse(text)
}

async function listLanguages() {
  const base = getBaseUrl()
  const res = await fetch(`${base}/languages`, {
    headers: buildHeaders(false),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Judge0 ${res.status}: ${text.slice(0, 500)}`)
  }
  return JSON.parse(text)
}

module.exports = {
  createSubmission,
  getSubmission,
  listLanguages,
  getBaseUrl,
}
