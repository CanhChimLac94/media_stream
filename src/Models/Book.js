var connection = "books";
var Entity = {
    username: String,
    fullname: String,
    year: Number
};

module.exports = function(db) {
    var mongoose = db.mongoose;
    var Schema = db.Schema;
    var model = mongoose.model(connection, new Schema(Entity));
    return model;
};