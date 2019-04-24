const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    unique: true,
    lowercase: true
  },
  firstname: {
    type: String,
    required: "name is Required",
    trim: true,
    lowercase: true
  },
  lastname: {
    type: String,
    required: "lastname is Required",
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength:6
  },
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  cc: {
    type: Number,
    required: true,
    trim: true,
    unique: true
  },
  roll: {
    type: String,
    required: true,
    trim: true
  },
  cursos: {
    type: Array,
    required: true,
    trim: true
  },
  avatar: {
    type: Buffer
  }
});

// create mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
