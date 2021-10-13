const db = require('../../config/db')
const {date} = require('../../lib/utils')

const Base = require('./Base')
Base.init({ table: 'chefs'})

module.exports = {
  ...Base,
}


// module.exports = {
//   all() {
//     return db.query(`
//     SELECT chefs.*, count(recipes) AS total_recipes
//     FROM chefs
//     LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
//     GROUP BY chefs.id;
//     `)
//   },
//   create({name, file_id}) {
//     const query =`
//       INSERT INTO chefs (
//         name,
//         file_id,
//         created_at
//       ) VALUES ($1, $2, $3)
//       RETURNING id
//     `
//     const values = [
//       name,
//       file_id,
//       date(Date.now()).iso
//     ]

//     return db.query(query, values)
//   },
//   update({name, file_id, id}) {
//     const query = `
//       UPDATE chefs SET
//       name=($1),
//       file_id=($2)
//       WHERE id = ($3)
//     `
//     const values = [
//       name,
//       file_id,
//       id
//     ]
    
//     return db.query(query, values)
//   },
//   findChef(chefId) {
//     return db.query(`
//     SELECT chefs.*, count(recipes) AS total_recipes
//     FROM chefs
//     LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
//     WHERE chefs.id = $1
//     GROUP BY chefs.id;
//     `, [chefId])
//   },
//   findChefRecipes(chefId) {
//     return db.query(`
//       SELECT * FROM recipes
//       WHERE recipes.chef_id = $1
//     `, [chefId])
//   },
//   delete(chefId) {
//     return db.query(`
//       DELETE FROM chefs WHERE id = $1
//     `, [chefId])
//   }

// }