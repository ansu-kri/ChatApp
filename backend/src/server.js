const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');
const connectDB = require('./lib/db.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
