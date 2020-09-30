const db = require('../../config/db')
const { hash } = require('bcryptjs')

const Base = require('./Base')
Base.init({ table: 'users'})

module.exports = {
  ...Base,
}

  // async findOne(filters) {
  //   let query = "SELECT * FROM users"
  
  //   Object.keys(filters).map(key => {
  //     query = ` ${query}
  //     ${key}
  //     `
  
  //     Object.keys(filters[key]).map(field => {
  //       query = `${query} ${field} = '${filters[key][field]}'`
  //     })
  //   })
  
  //   const results = await db.query(query)
  //   return results.rows[0]
  // },
  // async all() {
  //   const query = "SELECT * FROM users"
  
  //   const results = await db.query(query)
  //   return results.rows
  // },
  
  // async update(id, fields) {
  //   let query = `UPDATE users SET`
  
  //   Object.keys(fields).map((key, index, array) => {
  //     if((index + 1) < array.length) {
  //       query = `${query}
  //         ${key} = '${fields[key]}',
  //       `
  //     } else {
  //       query = `${query}
  //         ${key} = '${fields[key]}'
  //         WHERE id = ${id}
  //       `
  //     }
  //   })
  
  //   await db.query(query)
  //   return
  // }