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
  async showRecipes(req, res) {
    let results = await Recipe.all()
    
    async function getImage(recipeId) {
      let results = await File.files(recipeId)
      const recipeFiles = results.rows.map(recipeFile => `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`)

      return recipeFiles[0]
    }

    const recipesPromise = results.rows.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    }).filter((recipe, index) => index > 3 ? false : true)

    const recipes = await Promise.all(recipesPromise)

    return res.render('site/recipes', {recipes})
  },
  async showChefs(req, res) {
    let results = await Chef.all()

    async function getAvatar(fileId) {
      let results = await File.findChefAvatar(fileId)
      let chefAvatar = results.rows[0]

      chefAvatar = `${req.protocol}://${req.headers.host}${chefAvatar.path.replace("public", "")}`
      
      return chefAvatar
    }

    const chefsAvatarPromise = results.rows.map(async chef => {
      chef.img = await getAvatar(chef.file_id)
      return chef
    })

    const chefs = await Promise.all(chefsAvatarPromise)
    return res.render('site/chefs', {chefs})
  }
}