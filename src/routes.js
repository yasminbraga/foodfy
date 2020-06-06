const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const RecipeController = require('./app/controllers/RecipeController')
const ChefController = require('./app/controllers/ChefController')

// SITE
routes.get('/', function(req, res) {
    return res.render('site/index')
})
routes.get('/about', function(req, res) {
    return res.render('site/about')
})

// ADMIN RECIPES
routes.get('/admin/recipes/create', RecipeController.create)
routes.get('/admin/recipes', RecipeController.index)
routes.get('/admin/recipes/:id', RecipeController.showRecipe)
routes.get('/admin/recipes/:id/edit', RecipeController.edit)
routes.post('/admin/recipes', multer.array("photos", 5), RecipeController.post)
routes.put('/admin/recipes', multer.array("photos", 5), RecipeController.put)
routes.delete('/admin/recipes', RecipeController.delete)

// ADMIN CHEFS
routes.get('/admin/chefs/create', ChefController.create)
routes.get('/admin/chefs', ChefController.index)
routes.get('/admin/chefs/:id', ChefController.showChef)
routes.get('/admin/chefs/:id/edit', ChefController.edit)
routes.post('/admin/chefs', multer.single("avatar"), ChefController.post)
routes.put('/admin/chefs', multer.single("avatar"), ChefController.put)
routes.delete('/admin/chefs', ChefController.delete)

module.exports = routes