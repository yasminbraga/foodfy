const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
  async index(req, res) {
    let results = await Recipe.all()
    
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

    return res.render('site/index', {recipes})
  },
  showRecipes(req, res) {
    return res.render('site/recipes')
  },
  showChefs(req, res) {
    return res.render('site/chefs')
  }
}