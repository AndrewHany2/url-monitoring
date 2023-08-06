const smtp = require('./smtp.service');

class NotificationService {
  static async Send (to, subject, text) {
    await smtp.sendMail(to, subject, text);
  }
}
module.exports = NotificationService;
