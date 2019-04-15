const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  phone: {
    type: Number,
    require: true
  },
  id: {
    type: Number,
    require: true
  },
  roll: {
    type: String,
    require: true
  }
});

// create mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
