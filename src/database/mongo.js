if (global.mongoDb) {
    return module.exports = global.mongoDb;
} else {
    const mongoose = require('mongoose');
    const mongoDB = "mongodb+srv://tranvandungmelinh:thiendung1994@trandung.arnrv5l.mongodb.net/mediaStream?retryWrites=true&w=majority";
    // var mongoDB = 'mongodb://127.0.0.1/mediaStreaming';
  // const mongoDB = 'mongodb://frr9wp-27017.csb.app:80/mewsdb?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1';

    mongoose.connect(mongoDB, { useUrlParser: true, useUnifiedTopology: true, useNewUrlParser: true });
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
