import mongoose from 'mongoose';
import { orderModel } from '../models/orders.model.js';
import { DB_NAME, ROLE } from '../utils/constant.js';

export const create = (data) => {
  return orderModel.create(data);
};

export const findAllOrders = (userId, role) => {
  const pipeline = [];
  if (role == ROLE.USER) {
    pipeline.push({
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    });
  }
  pipeline.push(
    {
      $lookup: {
        from: DB_NAME.USER,
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $lookup: {
        from: DB_NAME.PRODUCT,
        localField: 'products.productId',
        foreignField: '_id',
        as: 'productDetails',
        pipeline: [
          {
            $addFields: {
              fullImagePath: {
                $concat: [`${process.env.BASE_URL}/public/`, '$image'],
              },
            },
          },
          {
            $project: {
              name: 1,
              image: '$fullImagePath',
              price: 1,
              category: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        userName: {
          $ifNull: [{ $arrayElemAt: ['$userDetails.name', 0] }, null],
        },
        productDetails: {
          $map: {
            input: '$productDetails',
            as: 'prod',
            in: {
              $mergeObjects: [
                '$$prod',
                {
                  quantity: {
                    $arrayElemAt: [
                      '$products.quantity',
                      { $indexOfArray: ['$products.productId', '$$prod._id'] },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        productDetails: 1,
        totalAmount: 1,
      },
    }
  );
  return orderModel.aggregate(pipeline);
};

export const findOrderById = (id, option) => {
  return orderModel.findById(id, option).populate('products.productId', 'name price');
};

export const updateById = (id, data) => {
  return orderModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteById = (id) => {
  return orderModel.findByIdAndDelete(id);
};

export const findOrderByUser = () => {
  return orderModel.aggregate([
    {
      $group: {
        _id: '$userId',
        totalOrders: { $sum: 1 },
        orders: { $push: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: DB_NAME.USER,
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        userName: { $arrayElemAt: ['$userDetails.name', 0] },
        totalOrders: 1,
        orders: 1,
      },
    },
  ]);
};
