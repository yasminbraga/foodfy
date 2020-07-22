const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "96c6225fd04cf4",
    pass: "86a88cad83275b"
  }
});
