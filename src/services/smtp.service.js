const keys = require('../keys');
const nodemailer = require('nodemailer');

const { emailCredentials } = keys;

const transporter = nodemailer.createTransport({
  host: emailCredentials.host,
  port: emailCredentials.port,
  secure: false,
  auth: {
    user: emailCredentials.auth,
    pass: emailCredentials.password
  }
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
async function sendMail (to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `${emailCredentials.email}`,
      to,
      subject,
      html: `<a href=${text}>Please Click to verify your account<a/>`
    });
    console.log('email sent');
    return { messageId: info.messageId };
  } catch (error) {
    console.log('email error', error);
    throw new Error(error);
  }
}
module.exports = { sendMail };
