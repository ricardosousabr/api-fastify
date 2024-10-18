const express = require('express')
const app = express()
require('dotenv').config()

app.use((req, res, next) => {
  console.log("Data de hoje", Date.now())
  next()
})

app.get('/', (req, res) => {
  res.send('hello Ricardo')
})


app.listen(process.env.PORT)
