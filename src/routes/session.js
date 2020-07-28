const express = require('express')

const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')

const SessionValidator = require('../app/validators/session')

// login/logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.get('/forgot-password', SessionController.forgot)
// routes.get('/password-reset', SessionController.reset)

module.exports = routes