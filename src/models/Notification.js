class Notification {
  constructor(type, recipient, subject, content) {
    this.type = type;
    this.recipient = recipient;
    this.subject = subject;
    this.content = content;
  }

  // Add methods to interact with the database or other services here
}

module.exports = Notification;
