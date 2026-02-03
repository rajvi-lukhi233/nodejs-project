const { userModel } = require("../models/users.model");

exports.findOne = (filter, option) => {
  return userModel.findOne(filter, option);
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
exports.findById = (id, option) => {
  return userModel.findById(id, option);
};