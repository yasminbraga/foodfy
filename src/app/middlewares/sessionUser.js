function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/users/login')
  }
  next()
}

function onlyAdminUsers(req, res, next) {
  if (!req.session.userId || !req.session.is_admin) {
    return res.redirect('/admin/users/profile')
  }
  next()
}

module.exports = {
  onlyUsers,
  onlyAdminUsers
}