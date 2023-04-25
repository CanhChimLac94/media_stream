if (global.mongoDb) {
    return module.exports = global.mongoDb;
} else {
    const mongoose = require('mongoose');
    const mongoDB = "mongodb+srv://tranvandungmelinh:2gvbeOwCyH6uQ92L@trandung.arnrv5l.mongodb.net/mediaStream?retryWrites=true&w=majority";
    // var mongoDB = 'mongodb://127.0.0.1/mediaStreaming';

    mongoose.connect(mongoDB, { useUrlParser: true, useUnifiedTopology: true });
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const Schema = mongoose.Schema;
    const data = {
        mongoose: mongoose,
        Schema: Schema
    };
    global.mongoDb = data;
    module.exports = data;
}
