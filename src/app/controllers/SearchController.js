const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
  async index(req, res) {

    try {
      
      let results,
          params = {}
      
      const {filter} = req.query

      if (!filter) return res.redirect("/recipes")

      params.filter = filter

      results = await Recipe.search(params)

      async function getImage(recipeId) {
        let results = await File.files(recipeId)
        const recipeFiles = results.rows.map(recipeFile => `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`)
  
        return recipeFiles[0]
      }

      const recipesPromise = results.rows.map(async recipe => {
        recipe.img = await getImage(recipe.id)
        return recipe
      })
  
      const recipes = await Promise.all(recipesPromise)

      const search = {
        term: req.query.filter
      }

      return res.render('site/search/index', {recipes, search})
      
    } catch (error) {
      console.error(error)
    }

  }
}