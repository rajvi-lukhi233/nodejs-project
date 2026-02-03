const express = require("express");
const route = express.Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const productRoute = require("./product.route")

route.use("/auth", authRoute);
route.use("/user", userRoute);
route.use("/product",productRoute)

module.exports = route;
