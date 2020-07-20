const User = require('../models/User')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  }
}