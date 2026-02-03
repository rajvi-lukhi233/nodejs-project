const express = require("express");
const { connectdb } = require("../config/dbConfig");
require("dotenv").config();
const indexRoute = require("./routes/index");
const path = require("path");
const app = express();
const port = process.env.PORT;
connectdb();
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api", indexRoute);
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
