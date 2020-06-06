const db = require("../../config/db")
const {date} = require("../../lib/utils")

module.exports = {
  all() {
    return db.query(
      `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.created_at DESC
      `
      )
  },
  create(data) {
    const query = `
      INSERT INTO recipes (
      title,
      chef_id, 
      ingredients, 
      preparation, 
      information, 
      created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const values = [
      data.title,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ]

    return db.query(query, values)
  },

  find(id) {
    return db.query(`SELECT * FROM recipes WHERE id = $1`, [id])
  },

  update(data) {
    const query = `
      UPDATE recipes SET
      title=($1),
      chef_id=($2),
      ingredients=($3),
      preparation=($4), 
      information=($5)
      WHERE id = ($6) 
    `
    const values = [
      data.title,
      data.chef_id,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    return db.query(`
      DELETE FROM recipes WHERE id = $1
    `, [id])
  }

}