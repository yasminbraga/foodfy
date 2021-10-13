const Recipe = require('../models/Recipe')
const User = require('../models/User')
const Chef = require('../models/Chef')

const {date} = require('../../lib/utils')

async function getImages(recipeId) {
  let files = await Recipe.files(recipeId)
  files = files.map(recipeFile => ({
    ...recipeFile,
    src: `${recipeFile.path.replace("public", "")}`
  }))

  return files
}

async function format(recipe) {
  const files = await getImages(recipe.id)
  recipe.img = files[0].src
  recipe.files = files
  recipe.chef = await Chef.find(recipe.chef_id)
  recipe.ingredients = Array.from(recipe.ingredients.split(",")),
  recipe.preparation = Array.from(recipe.preparation.split(","))

  const { day, hour, minutes, month } = date(recipe.updated_at)

  recipe.published = {
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}`,
  }

  return recipe
}

const LoadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },
  async recipe(){
    try {
      const recipe = await Recipe.find(this.filter)
      return format(recipe)
    } catch (error) {
      console.error(error)
    }
  },
  async recipes(){
    try {
      const recipes = await Recipe.findAll(this.filter)
      const recipesPromise = recipes.map(format)
      return Promise.all(recipesPromise)
    } catch (error) {
      console.error(error)
    }
  },
  format,
}

module.exports = LoadService