const User = require('../models/User')

async function post(req, res, next) {
    // check if has all fields
    const keys = Object.keys(req.body)

    for(key of keys) {
      if (req.body[key] == "") {
        return res.render('users/register', {
          user: req.body,
          error: 'Por favor, preencha todos os campos!'
        })
      }
    }

    // check if user exists
    let {email, name, is_admin} = req.body
    
    const user = await User.findOne({where: {email}})
    if (user) return res.render('user/register', {
      user: req.body,
      error: 'Usuário já cadastrado!'
    })

    next()
}

module.exports = {
  post
}