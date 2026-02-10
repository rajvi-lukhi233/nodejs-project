const { default: mongoose } = require('mongoose');
const { orderModel } = require('../models/orders.model');
const { DB_NAME, ROLE } = require('../utils/constant');

exports.create = (data) => {
  return orderModel.create(data);
};

exports.findAllOrders = (userId, role) => {
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

exports.findOrderById = (id, option) => {
  return orderModel.findById(id, option).populate('products.productId', 'name price');
};

exports.updateById = (id, data) => {
  return orderModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = (id) => {
  return orderModel.findByIdAndDelete(id);
};

exports.findOrderByUser = () => {
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
