const express = require('express');
const Signup = require("../controllers/auth.controllers")
const router = express.Router();

router.post("/signup", Signup);

router.get("/login",(req,res) =>{
    res.send("login endpoint")
})

router.get("/logout",(req,res) =>{
    res.send("logout endpoint")
})

module.exports = router