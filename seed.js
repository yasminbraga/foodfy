const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')

let usersIds = []

async function createUsers() {
  const users = []
  const password = await hash('123456', 8)

  while (users.length < 3) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      is_admin: false
    })
  }

  const usersPromise = users.map(user => User.create(user))

  usersIds = await Promise.all(usersPromise)
}

createUsers()