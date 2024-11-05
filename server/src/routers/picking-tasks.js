const express = require('express')
const routerMain = express.Router()
const {allTasks, taskByID, createTask, updateTask, deleteTask} = require('../controllers/todoController')

routerMain.post('/create', createTask)

routerMain.get('/', allTasks)

routerMain.get('/:id', taskByID)

routerMain.put('/update/:id', updateTask)

routerMain.delete('/delete/:id', deleteTask)

module.exports = routerMain