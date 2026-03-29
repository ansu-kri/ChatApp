require("dotenv").config();   // must be first

const connectDB = require("./src/lib/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
