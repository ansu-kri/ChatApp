const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true},
  password: { type: String, required: true, minlength:6, },
},
{timestamps: true } // createdat and updatedat
);

module.exports = mongoose.model("User", userSchema)
