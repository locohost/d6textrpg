module['exports'] = function myService(hook) {

    const jwt = require('jsonwebtoken'), 
          MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(hook.env.mongoUrl_DO, function (err, database) {
        const db = database.db('game');

        console.log("Connected to MongoDb: 'game' database!");
        console.log("Getting Areas...");

        db.collection('area').find({ 'del': false }).toArray(function (err, docs) {
            if (err) {
                ///TODO: LOG THIS in database!...
                hook.res.statusCode = 404;
                return hook.res.end('Error! ' + (err ? ': ' + err : ''));
            }
          	hook.res.statusCode = 201;
          	return hook.res.end(docs);
        });
    });
};
