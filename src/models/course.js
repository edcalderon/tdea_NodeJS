const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    lowercase: true
  },
  value: {
    type: Number,
    required: true
  },
  intensity: {
    type: Number,
    required: true
  },
  modality: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true
  },
  students: {
    type: Array
  }
});

// create mongoose model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
