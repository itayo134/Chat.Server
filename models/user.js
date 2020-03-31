const uuid = require('uuid').v4;

function User(userName) {
    this.name = userName;
    this.id = uuid();
}

module.exports = User;