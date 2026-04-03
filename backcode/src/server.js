require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { connectDb } = require('./db')
const apiRouter = require('./routes/api')

const PORT = Number(process.env.PORT) || 3001
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

const app = express()

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', apiRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

async function start() {
  await connectDb()

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`CORS origin: ${FRONTEND_ORIGIN}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
