const User = require("../models/User")
const { compare } = require('bcryptjs')

async function login(req, res, next) {
  try {
  const { email, password } = req.body

  const user = await User.findOne({ where: {email}})

  if (!user) return res.render('session/login', {
    user: req.body,
    error: "Usuário não cadastrado!"
  })

  const passed = await compare(password, user.password)

  if (!passed) return res.render('session/login', {
    user: req.body,
    error: "Senha incorreta, tente novamente!"
  })

  req.user = user

  next()
  } catch (error) {
    console.log(error)
  }
}

async function forgot(req, res, next) {
  const { email } = req.body

  try {
    let user = await User.findOne({ where: { email } })

    if(!user) return res.render('session/forgot-password', {
      user: req.body,
      error: 'Email não cadastrado!'
    })

    req.user = user

    next()

  } catch (error) {
    console.error(error)
  }
}

async function reset(req, res, next) {
  // procurar o usuário 
  const { email, password, passwordRepeat, token } = req.body

  const user = await User.findOne({ where: {email}})

  if (!user) return res.render('session/reset-form', {
    user: req.body,
    token,
    error: "Usuário não cadastrado!"
  })
  // ver se a senha bate
  if(password != passwordRepeat) return res.render('session/reset-form', {
    user: req.body,
    token,
    error: 'As senhas não conferem!'
  })
  // verificar se o token bate
  if (token != user.reset_token) return res.render('session/reset-form', {
    user: req.body,
    token,
    error: 'Token inválido! Solicite uma nova chave!'
  })
  // verificar se o token nao expirou
  let now = new Date()
  now = now.setHours(now.getHours())

  if (now > user.reset_token_expires) return res.render('session/reset-form', {
    user: req.body,
    token,
    error: 'Token expirado! Por favor, solicite uma nova chave.'
  })

  req.user = user
  next()
}

module.exports = {
  login,
  forgot,
  reset
}