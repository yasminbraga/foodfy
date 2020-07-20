const express = require('express')
const multer = require('../app/middlewares/multer')

const routes = express.Router()

const RecipeController = require('../app/controllers/RecipeController')
const SearchController = require('../app/controllers/SearchController')

// SEARCH
routes.get('/recipes/search', SearchController.index)

// ADMIN RECIPES
routes.get('/create', RecipeController.create)
routes.get('/', RecipeController.index)
routes.get('/:id', RecipeController.showRecipe)
routes.get('/:id/edit', RecipeController.edit)
routes.post('/', multer.array("photos", 5), RecipeController.post)
routes.put('/', multer.array("photos", 5), RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes