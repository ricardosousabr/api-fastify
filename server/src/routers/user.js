const express = require('express');
const routerUser = express.Router()
const {createUser, updateUser, deleteUser} = require('../controllers/userController')

routerUser.post('/create-user', createUser)

routerUser.put('/update-user/:id', updateUser)

routerUser.delete('/delete-user/:id', deleteUser)

module.exports = routerUser