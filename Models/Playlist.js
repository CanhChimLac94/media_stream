// earnings
const db = require("../database/mongo");

const connection = "data_playlist";
const Entity = {
  id: String,
  name: String,
  thumb: String,
  total: Number,
  createAt: Date,
  // description: String,

  channel: {
    type: String,
    default: 'youtube'
  }
};

// module.exports = function() {
//     const mongoose = db.mongoose;
//     const Schema = db.Schema;
//     return mongoose.model(connection, new Schema(Entity));
// };

module.exports = db.mongoose.model(
  connection,
  new db.Schema(Entity)
);