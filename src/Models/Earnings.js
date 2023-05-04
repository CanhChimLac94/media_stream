// earnings
var connection = "data_earnings";
var Entity = {
    uid: String,
    year: Number,
    month: Number,
    date: Number,
    cost: Number,
    action: String,
    detail: String,
};

module.exports = function(db) {
    var mongoose = db.mongoose;
    var Schema = db.Schema;
    var model = mongoose.model(connection, new Schema(Entity));
    return model;
};