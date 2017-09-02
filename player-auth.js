module['exports'] = function myService(hook) {

    const jwt = require('jsonwebtoken'), 
          MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(hook.env.mongoUrl_DO, function (err, database) {
        const db = database.db('game');

        console.log("Connected to MongoDb: 'game' database!");
        console.log("Authorizing Player...");

        db.collection('player').findOne({ 'userid': hook.params.userid, 'del': false }, function (err, player) {
            if (err || player == null) {
                ///TODO: LOG THIS in database!...
                hook.res.statusCode = 404;
                return hook.res.end('Not authorized! Invalid userId(' + hook.params.userid + ')' + (err ? ': ' + err : ''));
            }
            // Update player login stats
            const now = new Date();
            db.collection('player').updateOne({ '_id': player._id }, {
                $set: {
                    logins: player.logins + 1,
                    lastlogin: now,
                    modifiedon: now,
                    modifiedby: player.handle
                }
            }, function (err, plyr) {
                if (err || plyr.modifiedCount != 1) {
                    ///TODO: LOG THIS!...
                    hook.res.statusCode = 400;
                    return hook.res.end('Not authorized! Failed to update Player _id(' + player._id + '): ' + err);
                }
                // Create a new JWToken and send it back
                player.token = jwt.sign(
                    { "uid": player.userid, "roles": player.roles }, 
                    hook.env.jwtSecret, 
                    { "expiresIn": '12h', "issuer": hook.env.jwtIssuer }
                );
                console.log("Player (" + hook.params.userid + ") authorized");
                hook.res.statusCode = 201;
                return hook.res.end(player);
            });
        });
    });

};
