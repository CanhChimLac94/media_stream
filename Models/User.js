var connection = "data_users";
var Entity = {
    user_name: String,
    full_name: String,
    email: String,
    password: String,
    active: Boolean,
    code_authentication: String,
    info: String,
};

module.exports = function(db) {
    var mongoose = db.mongoose;
    var Schema = db.Schema;
    var model = mongoose.model(connection, new Schema(Entity));
    return model;
};