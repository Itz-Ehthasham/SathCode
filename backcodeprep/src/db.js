const mongoose = require('mongoose')

async function connectDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log('MONGODB_URI not set; skipping MongoDB')
    return
  }
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

module.exports = { connectDb }
