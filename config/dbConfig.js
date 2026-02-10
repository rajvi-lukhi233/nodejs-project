const mongoose = require("mongoose");

exports.connectdb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Database conneceted successfully.');
  } catch (error) {
    console.log('Failed to connect the database.', error);
  }
};
