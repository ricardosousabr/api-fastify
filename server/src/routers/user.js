const express = require('express');
const routerUser = express.Router()
const {getUser, createUser, updateUser, deleteUser} = require('../controllers/userController')

routerUser.get('/get-user', getUser)

routerUser.post('/create-user', createUser)

routerUser.put('/update-user/:id', updateUser)

routerUser.delete('/delete-user/:id', deleteUser)

module.exports = routerUser