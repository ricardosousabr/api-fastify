const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hello Ricardo')
})

app.listen(port, () => {
  console.log(`Rordando na porta ${port}`)
})
