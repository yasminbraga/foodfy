const Recipe = require('../models/Recipe')
const File = require('../models/File')

const LoadRecipesService = require('../services/LoadRecipesService')

module.exports = {
  async index(req, res) {

    try {
      
      let params = {}
      
      const {filter} = req.query

      if (!filter) return res.redirect("/recipes")

      params.filter = filter

      let recipes = await Recipe.search(params)

      const recipesPromise = recipes.map(LoadRecipesService.format)
  
      recipes = await Promise.all(recipesPromise)

      const search = {
        term: req.query.filter
      }

      return res.render('site/search/index', {recipes, search})
      
    } catch (error) {
      console.error(error)
    }

  }
}