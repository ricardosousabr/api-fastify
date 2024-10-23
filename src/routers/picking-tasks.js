const express = require('express')
const routerMain = express.Router()
// const task = ["Fazer compras"]
const {allTasks, deleteTask, createTask} = require('../controllers/todoController')

routerMain.post('/add-task', createTask)

routerMain.get('/', allTasks)

routerMain.get('/task', (req, res) => {
  console.log("displays an task")
})

routerMain.delete('/delete/:id', deleteTask)

routerMain.put('/update', (req, res) => {
  console.log("update in task")
})


module.exports = routerMain