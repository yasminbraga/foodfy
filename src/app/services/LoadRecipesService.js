const Recipe = require('../models/Recipe')

function format(recipe) {

}

const LoadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },
  async recipe(){
    try {
      const recipe = await Recipe.findOne(this.filter)
    } catch (error) {
      console.error(error)
    }
  },
  recipes(){},
  format,
}


module.exports = LoadService