module['exports'] = function myService(hook) {

    const jwt = require('jsonwebtoken'), 
          MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(hook.env.mongoUrl_DO, function (err, database) {
        // Verify the JWT token in header
        var token = hook.getHeader('authorization');
        if (!token) {
            ///TODO: Need to log this to database warn/error log
            return hook.res.end('Invalid token: Token is null');
        } else {
            // Strip off "Bearer[space]..." token prefix
            token = token.split(" ")[1];
            if (jwToken.VerifyToken(token)) {
                // We have a valid token, process request...
                const db = database.db('game');
                db.collection('area').find({ 'del': false }).toArray(function (err, docs) {
                    if (err) {
                        ///TODO: LOG THIS in database!...
                        hook.res.statusCode = 404;
                        return hook.res.end('Error! ' + (err ? ': ' + err : ''));
                    }
                    hook.res.statusCode = 201;
                    return hook.res.end(docs);
                });
            } else {
                ///TODO: Need to log this to database warn/error log
                return hook.res.end('Invalid token');
            }
        }

    });

};
