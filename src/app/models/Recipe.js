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
  async search(params) {
    const {filter} = params

    let query = "",
        filterQuery = `
          WHERE recipes.title ilike '%${filter}%'
        `
    query = `
      SELECT recipes.*, users.name AS chef_name
      FROM recipes
      LEFT JOIN users ON (recipes.user_id = users.id)
      ${filterQuery}
      ORDER BY recipes.created_at DESC
    `
    const results = await db.query(query)
    return results.rows
  }
}
