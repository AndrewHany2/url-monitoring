const smtp = require('./smtp.service');

class NotificationService {
  static async Send (to, subject, text) {
    smtp.sendMail(to, subject, text);
  }
}
module.exports = NotificationService;
