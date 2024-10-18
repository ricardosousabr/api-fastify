const express = require('express')
const app = express()
require('dotenv').config()
const routerMain = require('./routers/picking-tasks')

app.use('/tasks', routerMain)

app.listen(process.env.PORT)
