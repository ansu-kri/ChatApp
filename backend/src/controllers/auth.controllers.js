const generateToken = require("../lib/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fileds are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "email already exists" });
    //123$@12
    const salt = await bcrypt.genSalt(10);
    const hashedPassed = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassed,
    });
    if (newUser) {
      // generateToken(newUser._id,res)
      // await newUser.save()
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.email,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signup;
