const express = require('express')
const judge0 = require('../services/judge0')

const router = express.Router()

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'backcodeprep',
    time: new Date().toISOString(),
  })
})

/** Proxy: list Judge0 languages (ids for the editor / run payload). */
router.get('/judge0/languages', async (_req, res, next) => {
  try {
    const languages = await judge0.listLanguages()
    res.json(languages)
  } catch (err) {
    next(err)
  }
})

/**
 * Run user code via Judge0 (credentials stay on the server).
 * Body: { source_code: string, language_id: number, stdin?: string, wait?: boolean }
 */
router.post('/run', async (req, res, next) => {
  try {
    const { source_code, language_id, stdin, wait } = req.body ?? {}

    if (typeof source_code !== 'string' || !source_code.length) {
      return res.status(400).json({ error: 'source_code is required' })
    }
    if (
      language_id === undefined ||
      language_id === null ||
      Number.isNaN(Number(language_id))
    ) {
      return res.status(400).json({ error: 'language_id is required' })
    }

    const result = await judge0.createSubmission({
      source_code,
      language_id: Number(language_id),
      stdin: typeof stdin === 'string' ? stdin : '',
      wait: wait !== false,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
