const { orderModel } = require("../models/orders.model");
const { DB_NAME } = require("../utils/constant");

exports.create = (data) => {
  return orderModel.create(data);
};

exports.findAllOrders = () => {
  return orderModel.aggregate([
    {
      $lookup: {
        from: DB_NAME.USER,
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: DB_NAME.PRODUCT,
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
        pipeline: [
          {
            $addFields: {
              fullImagePath: {
                $concat: [`${process.env.BASE_URL}/public/`, "$image"],
              },
            },
          },
          {
            $project: {
              name: 1,
              image: "$fullImagePath",
              price: 1,
              category: 1,
            },
          },
        ],
      },
    },
   {
      $addFields: { 
        userName: { $arrayElemAt: ["$userDetails.name", 0] },
        productDetails: {
          $map: {
            input: "$productDetails",
            as: "prod",
            in: {
              $mergeObjects: [
                "$$prod",
                {
                  quantity: {
                    $arrayElemAt: [
                      "$products.quantity",
                      { $indexOfArray: ["$products.productId", "$$prod._id"] },
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
    },
  ]);
};
exports.findOrderById = (id, option) => {
  return orderModel
    .findById(id, option)
    .populate("products.productId", "name price");
};

exports.updateById = (id, data) => {
  return orderModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = (id) => {
  return orderModel.findByIdAndDelete(id);
};
