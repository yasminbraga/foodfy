const db = require("../../config/db")
const fs = require('fs')


const Base = require('./Base')
Base.init({ table: 'files'})

module.exports = {
  ...Base,
  // create({filename, path}) {
  //   const query = `
  //     INSERT INTO files (
  //       name,
  //       path
  //     ) VALUES ($1, $2)
  //     RETURNING id
  //   `
  //   const values = [
  //     filename,
  //     path
  //   ]

  //   return db.query(query, values)
  // },
  insertId({file_id, recipe_id}) {

    const query = `
      INSERT INTO recipe_files (
        file_id,
        recipe_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    values = [
      file_id,
      recipe_id
    ]
    return db.query(query, values)

  },
  // deleteFile(id) {
  //   return db.query(`
  //     DELETE FROM files WHERE id = $1
  //   `, [id])
  // },
  // findChefAvatar(fileId) {
  //   return db.query(`
  //     SELECT * FROM files WHERE id = $1
  //   `, [fileId])
  // },
  // chefFiles(chefId) {
  //   return db.query(`
  //     SELECT files.* FROM files
  //     LEFT JOIN chefs ON files.id = chefs.file_id
  //     WHERE chefs.id = $1
  //   `,[chefId])
  // },


}
