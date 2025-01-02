const express = require('express');
const Course = require('../models/course.model');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).send({ error: 'Only faculty can create courses' });
    }
    
    const course = new Course({
      ...req.body,
      enrolledStudents: []
    });
    
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send(courses);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/:courseId/register', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).send({ error: 'Only students can register for courses' });
    }
    
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).send({ error: 'Course is full' });
    }
    
    const newTotalCredits = req.user.totalCredits + course.credits;
    if (newTotalCredits > 20) {
      return res.status(400).send({ error: 'Credit limit exceeded' });
    }
    
    course.enrolledStudents.push({
      studentId: req.user.userId,
      name: req.user.name
    });
    
    req.user.totalCredits = newTotalCredits;
    
    await Promise.all([course.save(), req.user.save()]);
    res.send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;