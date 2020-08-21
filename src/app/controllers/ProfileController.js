const User = require("../models/User")

module.exports = {
  index(req, res) {
    const { user } = req
    return res.render('users/profile', {user})
  },
  async update(req, res) {
    try {
      const { user } = req
      let { name, email } = req.body

      await User.update(user.id, {
        name,
        email
      })

      return res.render('users/profile', {
        user: req.body,
        success: 'Conta atualizada com sucesso!'
      })

    } catch (error) {
      console.log(error)      
      return res.render('users/profile', {
        error: 'Um erro inesperado aconteceu, tente novamente.'
      })
    }
  }
}