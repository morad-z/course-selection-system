const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lecturerName: { type: String, required: true },
  credits: { 
    type: Number, 
    required: true,
    min: 3,
    max: 5
  },
  maxStudents: { type: Number, required: true },
  enrolledStudents: [{
    studentId: String,
    name: String
  }]
});

module.exports = mongoose.model('Course', courseSchema);
