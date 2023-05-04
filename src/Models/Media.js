const db = require("../database/mongo");

const connection = "media";
const Entity = {
    id: String,
    source: String,
    name: String,
    thumb: String,
    artist: String,
    youtubeSource: String,
    playlistId: String,
    channel: {
      type: String,
      default: 'youtube'
    }
};

module.exports = db.mongoose.model(
  connection,
  new db.Schema(Entity)
);