const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
  registerForm(req, res) {
    return res.render('users/register')
  },
  async post(req, res) {

    try {
      let { is_admin } = req.body
      // treatment of is_admin to post
      if(!is_admin) {
        result = {...req.body, is_admin:false}
      } else {
        result = {...req.body, is_admin:true}
      }
      
      // criar senha aleatoria
      const password = crypto.randomBytes(4).toString("hex")
      const user = {...result, password:password}
  
      // create User
      const userId = await User.create(user)
  
      // enviar senha por email
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@mail.com',
        subject: 'Cadastro no Foodfy',
        html: `<h2>Bem vindo ao Foodfy!</h2>
        <p>Para acessar sua conta faça o login com sua senha: ${user.password}</p>
        `
      })
  
  
      return res.render('users/register', {
        success: "Usuário cadastrado com sucesso"
      })
      
    } catch (error) {
      return res.render('users/register', {
        error: "Erro ao cadastrar usuário, por favor tente novamente."
      })
    }

    
  }
}