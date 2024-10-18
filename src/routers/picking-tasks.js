const express = require('express')
const routerMain = express.Router()

routerMain.get('/', () => {
  console.log("Rota criada")
})

routerMain.post('/send-task', () => {
  console.log("Novo picking task criado")
})

module.exports = routerMain