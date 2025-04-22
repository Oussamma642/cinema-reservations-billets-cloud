// controllers/authController.js

require('dotenv').config();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const JWT_SECRET = "secret"; // You can move this to env later

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "client", // Utilise le rôle fourni ou 'client' par défaut
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords from the response
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
