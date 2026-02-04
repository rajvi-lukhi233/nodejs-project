const express = require("express");
const { auth, authRole } = require("../middleware/authMiddleware");
const {
  craeteOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  webhook,
  createCheckoutPayment,
  createPaymentIntent,
  getUserWiseOrder,
} = require("../controllers/order.controller");
const { validation } = require("../middleware/validationMiddleware");
const {
  createOrderSchemaValidation,
  updateOrderSchemaValidation,
  deleteOrderSchemaValidation,
} = require("../validation/order.validation");
const { ROLE } = require("../utils/constant");
const route = express.Router();

route
  .get("/", auth, getAllOrders)
  .get("/getUserWiseOrder", auth, authRole(ROLE.ADMIN), getUserWiseOrder)
  .post("/", auth, validation(createOrderSchemaValidation), craeteOrder)
  .put("/:orderId", auth, validation(updateOrderSchemaValidation), updateOrder)
  .delete(
    "/:orderId",
    auth,
    validation(deleteOrderSchemaValidation),
    deleteOrder,
  );
module.exports = route;
