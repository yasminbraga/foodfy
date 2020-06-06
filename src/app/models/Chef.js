const db = require('../../config/db')
const {date} = require('../../lib/utils')

module.exports = {
  all() {
    return db.query(`
    SELECT * FROM chefs
    `)
  },
  create({name, file_id}) {
    const query =`
      INSERT INTO chefs (
        name,
        file_id,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `
    const values = [
      name,
      file_id,
      date(Date.now()).iso
    ]

    return db.query(query, values)
  },
  update({name, file_id, id}) {
    const query = `
      UPDATE chefs SET
      name=($1),
      file_id=($2)
      WHERE id = ($3)
    `
    const values = [
      name,
      file_id,
      id
    ]
    
    return db.query(query, values)
  },
  findChef(chefId) {
    return db.query(`
      SELECT * FROM chefs WHERE id = $1
    `, [chefId])
  },
  delete(chefId) {
    return db.query(`
      DELETE FROM chefs WHERE id = $1
    `, [chefId])
  }

}