const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const user = require('../validators/user')

module.exports = {
  registerForm(req, res) {
    return res.render('users/register')
  },
  show(req, res) {
    const { user } = req
    
    return res.render('users/show', {user})
  },
  async post(req, res) {
    try {
      const { is_admin } = req.body

      // treatment of is_admin to post
      if(!is_admin) {
        user = {...req.body, is_admin:false}
      } else {
        user = {...req.body, is_admin:true}
      }

      // create random password
      const password = crypto.randomBytes(4).toString("hex")
      user = {...user, password}

      const userId = await User.create(user)

      // send password by email
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@mail.com',
        subject: 'Cadastro no Foodfy',
        html: `<h2>Bem vindo ao Foodfy!</h2>
        <p>Para acessar sua conta faça o login com sua senha: ${user.password}</p>
        `
      })
      
      req.session.userId = userId

      return res.redirect('/admin/users')

    } catch (error) {
      return res.render('users/register', {
        user: req.body,
        error: "Erro ao cadastrar usuário, por favor tente novamente."
      })
    }
  },
  async update(req, res) {
    try {
      let { user } = req
      let {name, email, is_admin} = req.body

      if(!is_admin) {
        user = {...req.body, is_admin:false}
      } else {
        user = {...req.body, is_admin:true}
      }

      is_admin = user.is_admin
      
      await User.update(user.id, {
        name,
        email,
        is_admin
      })

      return res.render("users/show", {
        success: "Usuário atualizado com sucesso!"
      })

    } catch (error) {
      console.error(error)
      return res.render("users/show", {
        user: req.body,
        error: "Algum erro aconteceu!"
      })
    }
  },
  async list(req, res) {
    const users = await User.all()
    return res.render('users/list', {users})
  }
}