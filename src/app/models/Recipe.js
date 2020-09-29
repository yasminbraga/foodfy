const db = require("../../config/db")
const {date} = require("../../lib/utils")

const Base = require('./Base')
Base.init({ table: 'recipes'})

module.exports = {
  ...Base,
  async files(id) {
    const results = await db.query(`
      SELECT files.* FROM files
      LEFT JOIN recipe_files ON files.id = recipe_files.file_id 
      WHERE recipe_id = $1
    `, [id])

    return results.rows
  },
  search(params) {
    const {filter} = params

    let query = "",
        filterQuery = `
          WHERE recipes.title ilike '%${filter}%'
        `
    query = `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY recipes.created_at DESC
    `
    return db.query(query)
    
    
  }
}

 // all() {
  //   return db.query(
  //     `
  //     SELECT recipes.*, chefs.name AS chef_name
  //     FROM recipes
  //     LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
  //     ORDER BY recipes.created_at DESC
  //     `
  //   )
  // },
