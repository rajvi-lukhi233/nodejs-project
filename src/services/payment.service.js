const { paymentModel } = require('../models/payments.model');
const { DB_NAME } = require('../utils/constant');

exports.create = (data) => {
  return paymentModel.create(data);
};

exports.updatePayment = (filter, data) => {
  return paymentModel.findOneAndUpdate(filter, data, { new: true });
};

exports.findPayment = (filter, option) => {
  return paymentModel.findOne(filter, option);
};

exports.paymentList = () => {
  return paymentModel.aggregate([
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
        from: DB_NAME.ORDER,
        localField: 'orderId',
        foreignField: '_id',
        as: 'orderDetails',
      },
    },
    { $unwind: '$orderDetails' },
    {
      $lookup: {
        from: DB_NAME.PRODUCT,
        localField: 'orderDetails.products.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $addFields: {
        userName: { $arrayElemAt: ['$userDetails.name', 0] },
        'orderDetails.products': {
          $map: {
            input: '$orderDetails.products',
            as: 'prod',
            in: {
              $mergeObjects: [
                '$$prod',
                {
                  name: {
                    $arrayElemAt: [
                      '$productDetails.name',
                      {
                        $indexOfArray: ['$productDetails._id', '$$prod.productId'],
                      },
                    ],
                  },
                },
                {
                  price: {
                    $arrayElemAt: [
                      '$productDetails.price',
                      {
                        $indexOfArray: ['$productDetails._id', '$$prod.productId'],
                      },
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
        _id: 1,
        amount: 1,
        paymentStatus: 1,
        orderId: 1,
        userName: 1,
        userId: 1,
        'orderDetails.products': 1,
      },
    },
  ]);
};
