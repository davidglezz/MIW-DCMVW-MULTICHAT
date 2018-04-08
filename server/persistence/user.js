const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: {
    type: String
  },
});

module.exports = mongoose.model('user', schema);
