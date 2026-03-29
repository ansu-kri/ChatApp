const express = require('express');
// const cors = require("cors")
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

module.exports = app;
