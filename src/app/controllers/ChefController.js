const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
  async index(req, res) {

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
    return res.render('chefs/index', {chefs})
  },
  create(req, res) {
    return res.render('chefs/create')
  },
  async showChef(req, res) {

    let results = await Chef.findChef(req.params.id)
    const chef = results.rows[0]

    if (!chef) return res.send('Chef not found!')

    results = await File.findChefAvatar(chef.file_id)
    let chefAvatar = results.rows[0]

    chefAvatar = {
      ...chefAvatar,
      src: `${req.protocol}://${req.headers.host}${chefAvatar.path.replace("public", "")}`
    }

    // pegar as receitas do chefe
    results = await Chef.findChefRecipes(chef.id)
    let recipes = results.rows

    async function getImage(recipeId) {
      let results = await File.files(recipeId)
      const recipeFiles = results.rows.map(recipeFile => `${req.protocol}://${req.headers.host}${recipeFile.path.replace("public", "")}`)
      return recipeFiles[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    })

    recipes = await Promise.all(recipesPromise)

    return res.render('chefs/showChef', {chef, chefAvatar, recipes})
  },
  async post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") return res.send('Please fill all fields')
    }

    if (req.file.length == 0) return res.send('Please, send an avatar')

    let results = await File.create(req.file)
    const fileId = results.rows[0].id
    
    results = await Chef.create({...req.body, file_id:fileId})

    return res.send('ok')
  },
  async edit(req, res) {

    let results = await Chef.findChef(req.params.id)
    const chef = results.rows[0]

    if (!chef) return res.send('Chef not found!')

    results = await File.findChefAvatar(chef.file_id)
    let chefAvatar = results.rows[0]

    chefAvatar = {
      ...chefAvatar,
      src: `${req.protocol}://${req.headers.host}${chefAvatar.path.replace("public", "")}`
    }
 
    return res.render('chefs/edit', {chef, chefAvatar})
  },
  async put(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") return res.send('Please fill all fields')
    }
    
    chef = await Chef.findChef(req.body.id)
    let fileId = chef.rows[0].file_id

    let updatedFiles = {...chef,...req.body}

    if (req.file) {
        let results = await File.create(req.file)
        fileId = results.rows[0].id
        updatedFiles.file_id = fileId
      }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)
      
      const removedFilesPromise = removedFiles.map(id => {File.deleteFile(id)})
      await Promise.all(removedFilesPromise)
    }
    
    await Chef.update({...req.body, file_id: updatedFiles.file_id})

    return res.send('pk')
    
  },
  async delete(req, res) {
    
    let result = await File.chefFiles(req.params.id)
    const fileId = result.rows[0].id
    
    await File.deleteFile(fileId)
    
    await Chef.delete(req.body.id)
    return res.send('chef deletado')

  }
}