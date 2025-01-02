const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { userId, name, password, address, role, academicYear } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const user = new User({
      userId,
      name,
      password: hashedPassword,
      address,
      role,
      academicYear: role === 'student' ? academicYear : undefined
    });
    
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );
    
    res.send({ token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

module.exports = router;
