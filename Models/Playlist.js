// earnings
const db = require("../database/mongo");

const connection = "playlist";
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

module.exports = db.mongoose.model(
  connection,
  new db.Schema(Entity)
);