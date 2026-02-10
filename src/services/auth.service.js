const { userModel } = require('../models/users.model');

exports.findOne = (filter, option) => {
  return userModel.findOne({ deletedAt: null, ...filter }, option);
};
exports.createUser = (data) => {
  return userModel.create(data);
};
exports.updateUserById = (id, data) => {
  return userModel.findByIdAndUpdate(id, data, { new: true });
};
exports.deleteUser = (id) => {
  return userModel.findByIdAndDelete(id);
};
exports.findUserById = (id, option) => {
  return userModel.findById(id, option);
};
// exports.findAllUsers = async (limit = 10, page = 1) => {
//   const skip = (page - 1) * limit;
//   const filter = { deletedAt: null };
//   const [users, totalRecord] = await Promise.all([
//     userModel.find(filter).limit(limit).skip(skip),
//     userModel.countDocuments(filter),
//   ]);
//   return {
//     users,
//     totalRecord,
//     limit,
//     page,
//   };
// };

exports.findAllUsers = async (limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const result = await userModel.aggregate([
    {
      $match: { deletedAt: null },
    },
    {
      $facet: {
        users: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              email: 1,
              role: 1,
              isVerified: 1,
              createdAt: 1,
              updatedAt: 1,
              password: 1,
            },
          },
        ],
        totalRecord: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        users: 1,
        totalRecord: {
          $ifNull: [{ $arrayElemAt: ['$totalRecord.count', 0] }, 0],
        },
      },
    },
  ]);
  return result.length > 0 ? result[0] : { users: [], totalRecord: 0 };
};
