const express = require('express')
const multer = require('../app/middlewares/multer')

const routes = express.Router()

const ChefController = require('../app/controllers/ChefController')

//onlyAdmin
routes.get('/create', ChefController.create) 
routes.get('/', ChefController.index)
routes.get('/:id', ChefController.showChef)
routes.get('/:id/edit', ChefController.edit)
routes.post('/', multer.single("avatar"), ChefController.post)
routes.put('/', multer.single("avatar"), ChefController.put)
routes.delete('/', ChefController.delete)

module.exports = routes