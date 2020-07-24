const User = require('../models/User')


function checkAllFields(body) {
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "") {
      return res.render('users/register', {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      })
    }
  }
}

async function show(req, res, next) {
  const {userId: id} = req.session

  const user = await User.findOne({ where: {id}})

  if(!user) return res.render("users/register", {
    error: "Usuário não encontrado!"
  })

  req.user = user
  next()
}

async function post(req, res, next) {
    // check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
      return res.render('users/register', fillAllFields)
    }

    // check if user exists
    let {email} = req.body
    
    let user = await User.findOne({where: {email}})

    if (user) return res.render('users/register', {
      user: req.body,
      error: 'Usuário já cadastrado!'
    })

    next()
}

async function update(req, res, next) {

  const {id} = req.body

  const fillAllFields = checkAllFields(req.body)
  if (fillAllFields) {
    return res.render('users/show', fillAllFields)
  }
  
  const user = await User.findOne({ where: {id}})

  req.user = user

  next()

}

module.exports = {
  post,
  show,
  update
}