// const jwt = require("jsonwebtoken")

// const generateToken = (userID,res) =>{
//     const token = jwt.sign({userID},process.env.JWT_SECRET,{
//         expiresIn: "7d"
//     });
//     res.cookie("jwt",token,{
//         maxAge: 7*24*60*60*1000, //ms
//         httpOnly: true, // prevent xss attacks:cross-site scripting
//         sameSite: "strict", // CSRF attacks
//         secure: process.env.NODE_ENV === "development" ? false : true,
//     });
//     return token
// }

// module.exports = generateToken;


const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({
    userId: user._id,
  }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;