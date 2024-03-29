const User = require('../models/User')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

const LoadRecipesService = require('../services/LoadRecipesService')

module.exports = {
  async index(req, res) {
    try {
      const allRecipes = await LoadRecipesService.load('recipes')
      const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true)      

      return res.render('recipes/index', {recipes})

    } catch (error) {
      console.error(error)
    }
  },
  async create(req, res) {
    try {
      const chefs = await Chef.findAll()

      return res.render('recipes/create')

    } catch (error) {
      console.error(error)
    }
  },
  async showRecipe(req, res) {
    try {
      let recipe = await LoadRecipesService.load('recipe', req.params.id)

      return res.render('recipes/showRecipe', {recipe})

    } catch (error) {
      console.error(error)   
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)
      for (key of keys) {
        if (req.body[key] == "") return res.send('Please, fill all fields!')
      }

      if (req.files.length == 0) return res.send('Please, send at least one image')

      let {
        title,
        ingredients,
        preparation,
        information,
      } = req.body

      let recipeId = await Recipe.create({
        title,
        ingredients,
        preparation,
        information,
        user_id: req.session.userId
      })


      const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path }))
      let fileResults = await Promise.all(filesPromise)

      const idPromise = fileResults.map(file => File.insertId({fileId: file.id, recipeId}))
      await Promise.all(idPromise)

      return res.redirect(`recipes/${recipeId}`)

    } catch (error) {
      console.error(error);
    }
  },

  async edit(req, res) {

    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.send('Recipe not found!')
    
    results = await Chef.all()
    const chefs = results.rows
    
    results = await File.files(recipe.id)
    let files = results.rows
    
    let recipeFiles = files.map(recipeFile => ({
      ...recipeFile,
      src: `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`
    }))
    
    return res.render('recipes/edit', {recipe, chefs, recipeFiles})
  },

  async put(req, res) {
    const keys = Object.keys(req.body)
    
    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") return res.send('Please, fill all fields!')
    }
    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create(file))
      let newFilesResult = await Promise.all(newFilesPromise)

      const idPromise = newFilesResult.map(file => File.insertId({fileId: file.rows[0].id, recipeId: req.body.id}))
      await Promise.all(idPromise)
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map(id => {File.deleteFile(id)})
      await Promise.all(removedFilesPromise)
    }

    await Recipe.update(req.body)

    return res.redirect(`/admin/recipes/${req.body.id}`)
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id)
    return res.redirect('/admin/recipes')
  }
}