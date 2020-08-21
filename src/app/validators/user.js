const User = require('../models/User')
const { compare } = require('bcryptjs')


function checkAllFields(body) {
  const keys = Object.keys(body)

  for(key of keys) {
    if (body[key] == "") { return {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      }
    }
  }
}

async function index(req, res, next) {
  const {userId: id} = req.session

  const user = await User.findOne({ where: {id}})

  if(!user) return res.render('users/register', {
    error: "Usuário não encontrado!"
  })

  req.user = user
  next()
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

  const fillAllFields = checkAllFields(req.body)
  if (fillAllFields) {
    return res.render('users/profile', fillAllFields)
  }
  
  const {id, password} = req.body
  
  if (!password) return res.render('users/profile', {
    user: req.body,
    error: 'Digite sua senha para atualizar seu cadastro!'
  })

  const user = await User.findOne({ where: {id}})
  const passed = await compare(password, user.password)

  if(!passed) return res.render('users/profile', {
    user: req.body,
    error: 'Senha incorreta, por favor tente novamente!'
  })
  
  req.user = user

  next()

}

module.exports = {
  index,
  post,
  show,
  update
}