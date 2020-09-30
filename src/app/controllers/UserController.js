const User = require('../models/User')
const Recipe = require('../models/Recipe')

const mailer = require('../../lib/mailer')

const crypto = require('crypto')
const user = require('../validators/user')

const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')


module.exports = {
  // admin
  registerForm(req, res) {
    return res.render('users/register')
  },
  // user
  show(req, res) {
    const { user } = req
    
    return res.render('users/show', {user})
  },
  // admin
  async post(req, res) {
    try {
      let { is_admin, name, email } = req.body

      // treatment of is_admin to post
      if(!is_admin) {
        is_admin = false
      } else {
        is_admin = true
      }

      // create random password
      // let password = crypto.randomBytes(4).toString("hex")
      let password = 'yasmin'
      console.log(password)
      password = await hash(password, 8)

      const newUserId = await User.create({
        name,
        email,
        password,
        is_admin
      })

      // send password by email
      await mailer.sendMail({
        to: email,
        from: 'no-reply@mail.com',
        subject: 'Cadastro no Foodfy',
        html: `<h2>Bem vindo ao Foodfy!</h2>
        <p>Para acessar sua conta faça o login com sua senha: ${password}</p>
        `
      })
      
      const userId = req.session.userId

      return res.redirect('/admin/users/list')

    } catch (error) {
      console.error(error)
      return res.render('users/register', {
        user: req.body,
        error: "Erro ao cadastrar usuário, por favor tente novamente."
      })
    }
  },
  // user
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
  // admin
  async list(req, res) {
    const users = await User.findAll()
    return res.render('users/list', {users})
  },
  // usuario deletando a propria conta
  async delete(req, res) {
    try {
      const recipes = await Recipe.findAll({where: { user_id: req.body.id }})

      const allFilesPromise = recipes.map(recipe => 
        Recipe.files(recipe.id))
      
      let promiseResults = await Promise.all(allFilesPromise)

      await User.delete(req.body.id)
      req.session.destroy()

      promiseResults.map(files => {
        files.map(file => {
          unlinkSync(file.path)
        })
      })

      return res.render("session/login", {
        success: "Conta deletada com sucesso!"
      })
      
    } catch (error) {
      console.error(error)
    }
  }
}