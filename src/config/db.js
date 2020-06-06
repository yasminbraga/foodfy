const { Pool } = require("pg")

module.exports = new Pool({
  user: "yasminbraga",
  password: "yasmin04",
  host: "localhost",
  port: 5432,
  database: "foodfy"
})