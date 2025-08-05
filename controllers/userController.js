const User = require('../models/user');
const bcrypt = require('bcryptjs');


const { sendWelcomeEmail } = require('../services/emailService');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department: role !== 'admin' ? department : undefined
    });



    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, name, password, role); // original password here

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

