const Recipe = require("../models/Recipe")
const User = require("../models/User")
const File = require("../models/File")

module.exports = {
  async index(req, res) {
    try {
      // let results = await Recipe.all()
      let recipes = await Recipe.findAll()
      
      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId)
        files = files.map(recipeFile => `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`)
  
        return files[0]
      }

      const recipesPromise = recipes.map(async recipe => {
        recipe.img = await getImage(recipe.id)
        recipe.chef = await User.find(recipe.user_id)
        return recipe
      })

      recipes = await Promise.all(recipesPromise)

      return res.render('site/index', {recipes})

    } catch (error) {
      console.error(error)
    }
    
  },
  about(req, res) {
    return res.render('site/about')
  },
  async showRecipes(req, res) {
    let recipes = await Recipe.findAll()
    
    async function getImage(recipeId) {
      let recipeFiles = await Recipe.files(recipeId)
      recipeFiles = recipeFiles.map(recipeFile => `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`)

      return recipeFiles[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      recipe.chef = await User.find(recipe.user_id)
      return recipe
    }).filter((recipe, index) => index > 3 ? false : true)

    recipes = await Promise.all(recipesPromise)
    console.log(recipes)

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