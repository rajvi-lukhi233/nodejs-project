const {
  create,
  findAllOrders,
  updateById,
  deleteById,
  findOrderById,
  findOrderByUser,
} = require('../services/order.service');
const { findProductById } = require('../services/product.service');
const { logger } = require('../utils/logger');
const { errorResponse, successResponse } = require('../utils/resUtil');

exports.getAllOrders = async (req, res) => {
  try {
    logger.info('Orderes fatched.');
    const { userId, role } = req.user;
    const orders = await findAllOrders(userId, role);
    return successResponse(res, 200, 'Orders list retrive successfully.', orders);
  } catch (error) {
    logger.error(`getAllOrders API Error:${error.message}`);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

exports.craeteOrder = async (req, res) => {
  try {
    logger.info('Ordere created.');
    const { products, shippingAddress } = req.body;
    const { userId } = req.user;
    let totalAmount = 0;
    for (item of products) {
      const product = await findProductById(item.productId);
      if (!product) {
        return errorResponse(res, 404, `This product is not found:${item.productId}`);
      }
      totalAmount += product.price * (item.quantity || 1);
    }
    const order = await create({
      userId,
      products,
      shippingAddress,
      totalAmount,
    });
    if (order) {
      return successResponse(res, 201, 'Order created successfully.', order);
    }
    return errorResponse(res, 400, 'Order not created.');
  } catch (error) {
    logger.error(`craeteOrder API Error:${error.message}`);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

exports.updateOrder = async (req, res) => {
  try {
    logger.info('Ordere updated.');
    const { orderId } = req.params;
    const { products, shippingAddress } = req.body;
    const { userId } = req.user;
    let totalAmount = 0;
    const order = await findOrderById(orderId);
    if (!order) {
      return errorResponse(res, 404, 'Order not found.');
    }
    if (products) {
      for (item of products) {
        const product = await findProductById(item.productId);
        if (!product) {
          return errorResponse(res, 404, `Thisproduct not found:${item.productId}`);
        }
        totalAmount += product.price * (item.quantity || 1);
      }
    }
    const updatedorder = await updateById(orderId, {
      userId,
      products: products ? products : order.products,
      shippingAddress,
      totalAmount,
    });
    if (updatedorder) {
      return successResponse(res, 200, 'Order updated successfully.', updatedorder);
    }
    return errorResponse(res, 400, 'Order not updated.');
  } catch (error) {
    logger.error(`updateOrder API Error:${error.message}`);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    logger.info('Orderes deleted.');
    const { orderId } = req.params;
    const order = await findOrderById(orderId, { id: 1 });
    if (!order) {
      return errorResponse(res, 404, 'Order not found.');
    }
    await deleteById(orderId);
    return successResponse(res, 200, 'Order deleted successfully.');
  } catch (error) {
    logger.error(`deleteOrder API Error:${error.message}`);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

exports.getUserWiseOrder = async (req, res) => {
  try {
    const orders = await findOrderByUser();
    if (!orders || orders.length == 0) {
      return errorResponse(res, 400, 'Orders not found');
    }
    return successResponse(res, 200, 'Order list retrive successfully.', orders);
  } catch (error) {
    logger.error(`getUserWiseOrder API Error:${error.message}`);
    return errorResponse(res, 500, 'Internal server error.');
  }
};
