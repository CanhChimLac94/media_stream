// earnings
var connection = "data_media";
var Entity = {
    name: String,
    link: String,
    createAt: Date,
    description: String,
};

module.exports = function(db) {
    var mongoose = db.mongoose;
    var Schema = db.Schema;
    var model = mongoose.model(connection, new Schema(Entity));
    return model;
};