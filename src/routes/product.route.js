const express = require("express");
const { validation } = require("../middleware/validationMiddleware");
const { addProduct } = require("../controllers/product.controller");
const { productSchemaValidation } = require("../validation/product.validation");
const { upload } = require("../utils/multer");
const { auth, authRole } = require("../middleware/authMiddleware");
const { ROLE } = require("../utils/constant");
const route = express.Router();

route.post(
  "/addProduct",
  auth,
  authRole(ROLE.ADMIN),
  upload.single("image"),
  validation(productSchemaValidation),
  addProduct,
);

module.exports = route;
