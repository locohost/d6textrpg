
module['exports'] = function handleHookSource(req, res) {

    const jwt = require('jsonwebtoken'), 
          MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(req.env.mongoUrl_DO, function (err, database) {
        // Verify the JWT token in header
        var token = req.getHeader('authorization');
        if (!token) {
            ///TODO: Need to log this to database warn/error log
            return res.end('Invalid token: Token is null');
        } else {
            // Strip off "Bearer[space]..." token prefix
            token = token.split(" ")[1];
            if (jwToken.VerifyToken(token)) {
                // We have a valid token, process request...
                const db = database.db('game');
                db.collection('area').find({ 'del': false }).toArray(function (err, docs) {
                    if (err) {
                        ///TODO: LOG THIS in database!...
                        res.statusCode = 404;
                        return res.end('Error! ' + (err ? ': ' + err : ''));
                    }
                    res.statusCode = 201;
                    return res.end(docs);
                });
            } else {
                ///TODO: Need to log this to database warn/error log
                return res.end('Invalid token');
            }
        }

    });

};
