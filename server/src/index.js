const express = require('express')
const app = express()
require('dotenv').config()
//const routerMain = require('./routers/picking-tasks')
const bodyParser = require('body-parser')
app.use(bodyParser.json());
const connectToMongoDB = require('./conection/conection')

connectToMongoDB()
//app.use('/tasks', routerMain)

// eslint-disable-next-line no-undef
app.listen(process.env.PORT)
