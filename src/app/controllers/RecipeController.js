const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

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
    console.log(recipes)

    return res.render('recipes/index', {recipes})
  },
  create(req, res) {

    // Pegar os chefes
    Chef.all()
      .then(function(results) {
        const chefs = results.rows

        return res.render('recipes/create', { chefs })
      }).catch(function(err) {
        throw new Error(err)
      })
  },

  async showRecipe(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.send("Recipe Not Found!")

    results = await Chef.findChef(recipe.chef_id)
    const chef = results.rows[0]

    results = await File.files(recipe.id)
    let files = results.rows

    let recipeFiles = files.map(recipeFile => ({
      ...recipeFile,
      src: `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`
    }))

    return res.render('recipes/showRecipe', {recipe, chef, recipeFiles})
    
  },

  async post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") return res.send('Please, fill all fields!')
    }

    if (req.files.length == 0) return res.send('Please, send at least one image')

    let results = await Recipe.create(req.body)
    const recipeId = results.rows[0].id

    const filesPromise = req.files.map(file => File.create(file))
    let fileResults = await Promise.all(filesPromise)

    const idPromise = fileResults.map(file => File.insertId({fileId: file.rows[0].id, recipeId}))
    const fileIdResults = await Promise.all(idPromise)

    return res.send('ok')

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