const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dilipsarvaiya:5ckqPfiMEcIc5qnl@namastenodejs.qxjng.mongodb.net/devTinderDB"
  );
};

module.exports = connectDB;
