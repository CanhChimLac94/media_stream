var Book = require("../Models/Book");

module.exports = function(db) {
    Book = new Book(db);
    return {
        getBooks: function(req, res, next) {
            Book.find({}, "", function(err, us) {
                return res.json(us);
            });
        },

    }
}