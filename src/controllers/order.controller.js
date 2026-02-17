import {
  create,
  findAllOrders,
  updateById,
  deleteById,
  findOrderById,
  findOrderByUser,
} from '../services/order.service.js';
import { findProductById } from '../services/product.service.js';

export const getAllOrders = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const orders = await findAllOrders(userId, role);
    return res.success(200, 'Orders list retrive successfully.', orders);
  } catch (error) {
    console.log('getAllOrders API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const craeteOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;
    const { userId } = req.user;
    let totalAmount = 0;
    for (let item of products) {
      const product = await findProductById(item.productId);
      if (!product) {
        return res.fail(404, `This product is not found:${item.productId}`);
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
      return res.success(201, 'Order created successfully.', order);
    }
    return res.fail(400, 'Order not created.');
  } catch (error) {
    console.log('craeteOrder API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { products, shippingAddress } = req.body;
    const { userId } = req.user;
    let totalAmount = 0;
    const order = await findOrderById(orderId);
    //1. checking is existing order
    if (!order) {
      return res.fail(404, 'Order not found.');
    }
    if (products) {
      for (let item of products) {
        const product = await findProductById(item.productId);
        if (!product) {
          return res.fail(404, `Thisproduct not found:${item.productId}`);
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
      return res.success(200, 'Order updated successfully.', updatedorder);
    }
    return res.fail(400, 'Order not updated.');
  } catch (error) {
    console.log('updateOrder API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await findOrderById(orderId, { id: 1 });
    //1. checking is existing order
    if (!order) {
      return res.fail(404, 'Order not found.');
    }
    //2. delete order
    await deleteById(orderId);
    return res.success(200, 'Order deleted successfully.');
  } catch (error) {
    console.log('GetMessageList API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const getUserWiseOrder = async (req, res) => {
  try {
    const orders = await findOrderByUser();
    if (!orders || orders.length == 0) {
      return res.fail(400, 'Orders not found');
    }
    return res.success(200, 'Order list retrive successfully.', orders);
  } catch (error) {
    console.log('getUserWiseOrder API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};
