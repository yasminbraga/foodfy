const express = require('express')

const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')

// admin 
// routes.get('/admin/profile', ProfileController.index)
// routes.put('/admin/profile', ProfileController.put)

// admin users management
// routes.get('/admin/users', UserController.list)
routes.get('/register', UserController.registerForm)
routes.post('/', UserValidator.post, UserController.post)
// routes.put('/admin/users', UserController.put)
// routes.delete('/admn/users', UserController.delete)


module.exports = routes