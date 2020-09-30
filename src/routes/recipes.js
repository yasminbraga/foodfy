const express = require('express')
const multer = require('../app/middlewares/multer')

const routes = express.Router()

const RecipeController = require('../app/controllers/RecipeController')
const SearchController = require('../app/controllers/SearchController')

const { onlyUsers } = require('../app/middlewares/sessionUser')

// SEARCH
routes.get('/recipes/search', SearchController.index)

// ADMIN RECIPES
routes.get('/create', onlyUsers, RecipeController.create)
routes.get('/', RecipeController.index)
routes.get('/:id', RecipeController.showRecipe)
routes.get('/:id/edit', onlyUsers, RecipeController.edit)
routes.post('/', multer.array("photos", 5), onlyUsers, RecipeController.post)
routes.put('/', multer.array("photos", 5), onlyUsers, RecipeController.put)
routes.delete('/', onlyUsers, RecipeController.delete)

module.exports = routes