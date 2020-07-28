const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/SiteController')

const recipes = require('./recipes')
routes.use('/admin/recipes', recipes)

const chefs = require('./chefs')
routes.use('/admin/chefs', chefs)

const adminUsers = require('./users')
routes.use('/admin/users', adminUsers)

const sessionUsers = require('./session')
routes.use('/users', sessionUsers)

// routes.get('/', SiteController.index)
// routes.get('/about', SiteController.about)
// routes.get('/recipes', SiteController.showRecipes)
// routes.get('/chefs', SiteController.showChefs)

module.exports = routes