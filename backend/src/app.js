const express = require('express');
const cors = require("cors")
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

const app = express();

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
// }))

// CORS Configuration (Production Safe)
const allowedOrigins = [
  "http://localhost:3000", // local dev
  process.env.FRONTEND_URL, // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

module.exports = app;
