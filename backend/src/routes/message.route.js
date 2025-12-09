const express = require('express');

const router = express.Router();

router.get("/send", (req,res) => {
    res.send("Send Message endpoint");
})

module.exports = router