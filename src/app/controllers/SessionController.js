const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },
  async login(req, res) {
    try {
      req.session.userId = req.user.id
      req.session.is_admin = req.user.is_admin

      return res.redirect('/admin/users/profile')
      
    } catch (error) {
        console.error(error)
        return res.render('session/login', {
          user: req.body,
          error: "Erro inesperado, tente novamente!"
        })
    }
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/users/login")
  },
  forgotForm(req, res) {
    return res.render('session/forgot-password')
  },
  async forgot(req, res) {
    const user = req.user 
    try {
      const token = crypto.randomBytes(20).toString("hex")

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Perdeu a chave?</h2>
          <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `
      })

      return res.render('session/forgot-password', {
        success: "Verifique seu email para resetar sua senha!"
      })

    } catch (error) {
      console.error(error)
      return res.render('session/forgot-password', {
        error: "Algum erro aconteceu, tente novamente."
      })
    }
    
  },
  resetForm(req, res) {
    return res.render('session/reset-form', { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body
    
    try {
      //cria um novo hash de senha
      const newPassword = await hash(password, 8)
      //atualiza o usuário
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      })
      // avisa o usuario que ele tem uma nova senha
      return res.render('session/login', {
        user: req.body,
        success: 'Senha atualizada! Faça seu login!'
      })
    } catch (error) {
      console.error(error)
      return res.render('session/reset-form', {
        user: req.body,
        token,
        error: "Algum erro aconteceu, tente novamente."
      })
    }
  }
}