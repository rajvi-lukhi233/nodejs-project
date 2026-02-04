const express = require("express");
const { connectdb } = require("../config/dbConfig");
require("dotenv").config();
const indexRoute = require("./routes/index");
const path = require("path");
const rateLimit = require("express-rate-limit");
const app = express();
const port = process.env.PORT;
connectdb();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  // standardHeaders: true,
  // legacyHeaders: false,
});
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(limiter);
app.use("/api", indexRoute);
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
