const generateToken = require("../lib/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==================== SIGNUP ====================
exports.signup = async (req, res) => {
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
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//========================LOGIN==================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentitals" });
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid credentitals" });

    const token = generateToken(user._id);

    res.status(200).json({
      message :"Login successful",
      token,
      user:{
        _id: user._id,
        name: user.name,
      }
    })
  } catch (error) {
    console.error("Error in login:", error.message);
    console.error(error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
   }
}

