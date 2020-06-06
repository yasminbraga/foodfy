const db = require("../../config/db")
const fs = require('fs')

module.exports = {
  create({filename, path}) {

    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `
    const values = [
      filename,
      path
    ]

    return db.query(query, values)
  },
  insertId({fileId, recipeId}) {
    const query = `
      INSERT INTO recipe_files (
        file_id,
        recipe_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    values = [
      fileId,
      recipeId
    ]
    return db.query(query, values)

  },
  files(id) {
    return db.query(`
      SELECT files.* FROM files
      LEFT JOIN recipe_files ON files.id = recipe_files.file_id 
      WHERE recipe_id = $1
    `, [id])
  },
  deleteFile(id) {
    return db.query(`
      DELETE FROM files WHERE id = $1
    `, [id])
  },
  findChefAvatar(fileId) {
    return db.query(`
      SELECT * FROM files WHERE id = $1
    `, [fileId])
  },
  chefFiles(chefId) {
    return db.query(`
      SELECT files.* FROM files
      LEFT JOIN chefs ON files.id = chefs.file_id
      WHERE chefs.id = $1
    `,[chefId])
  },


}
