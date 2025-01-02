const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty'], required: true },
  academicYear: { type: Number, required: function() { return this.role === 'student'; } },
  totalCredits: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function(v) {
        return this.role !== 'student' || v <= 20;
      },
      message: 'Students cannot exceed 20 credits'
    }
  }
});

module.exports = mongoose.model('User', userSchema);