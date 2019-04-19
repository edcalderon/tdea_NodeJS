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
    validate: [
     function(input) {
       return input.length >= 6;
     },
      "Password should be longer."
    ]
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
  }
});

// create mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
