const express = require('express')

const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')
const { onlyUsers, onlyAdminUsers } = require('../app/middlewares/sessionUser')

// user profile (admin e user) 
routes.get('/profile', onlyUsers, UserValidator.index, ProfileController.index) // onlyUser
routes.put('/profile', onlyUsers, UserValidator.update, ProfileController.update) //onlyUser

// admin users management
routes.get('/', onlyAdminUsers, UserValidator.show, UserController.show) //onlyAdmin
routes.get('/list', onlyAdminUsers, UserController.list) //onlyAdmin
routes.get('/register', onlyAdminUsers, UserController.registerForm) // onlyAdmin
routes.post('/', onlyAdminUsers, UserValidator.post, UserController.post) //onlyAdmin
routes.put('/', onlyAdminUsers, UserValidator.update, UserController.update) //onlyAdmin
// routes.delete('/admn/users', UserController.delete) //onlyAdmin


module.exports = routes