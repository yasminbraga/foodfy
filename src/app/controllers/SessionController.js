const User = require('../models/User')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },
  async login(req, res) {
    try {
      req.session.userId = req.user.id

      return res.send("ok")
      
    } catch (error) {
      console.error(error)
      return res.render('session/login', {
        user: req.body,
        error: "Erro inesperado, tente novamente!"
      })
    }

  }
}