"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Gremlin = require("gremlin");
var mongodb_1 = require("mongodb");
var config_1 = require("./config");
console.log("connect to mongo");
var mongoClient = new mongodb_1.MongoClient();
mongoClient.connect("mongodb://dxreporting:xYBapAv917yQKK4DvVddgGbcR6GgmT14yR9iY192oQXDH9UOvT5Up96eWw7yUo0UpZzgJAZbDQ0HGA5QfLgC1A==@dxreporting.documents.azure.com:10255/dxreporting?ssl=true", function (err, db) {
    var cursor = db.collection('users').find();
    cursor.each(function (err, doc) {
        if (doc != null) {
            console.log(doc);
            console.log("closing mongo connection");
            db.close();
        }
        else {
            db.collection('users').insertOne({
                "id": "dc12c7b9-0e86-4220-a116-f1ff0e1ffb2d",
                "name": "Richard diZerega",
                "github_token": "abc64cfbf0f14e93cbfd3640afec69ab2ff9e26c"
            }, function (err, result) {
                if (err != null)
                    console.log("inserted");
                else
                    console.log(err);
                console.log("closing mongo connection");
                db.close();
            });
        }
    });
});
var client = Gremlin.createClient(443, config_1.config.endpoint, {
    "session": false,
    "ssl": true,
    "user": "/dbs/" + config_1.config.database + "/colls/" + config_1.config.collection,
    "password": config_1.config.primaryKey
});
client.on("error", function (err) {
    client.cancelPendingCommands({ message: 'Connection error', details: err });
});
console.log('Running Drop');
client.execute('g.V().drop()', {}, function (err, results) {
    if (err)
        return console.error(err);
    console.log(results);
    console.log();
    console.log('Running Add Vertex1');
    client.execute("g.addV('person').property('id', 'thomas').property('firstName', 'Thomas').property('age', 44)", {}, function (err, results) {
        if (err)
            return console.error(err);
        console.log(JSON.stringify(results));
        console.log();
        console.log('Running Add Vertex2');
        client.execute("g.addV('person').property('id', 'mary').property('firstName', 'Mary').property('lastName', 'Andersen').property('age', 39)", {}, function (err, results) {
            if (err)
                return console.error(err);
            console.log(JSON.stringify(results));
            console.log();
            console.log('Running Add Edge');
            client.execute("g.V('thomas').addE('knows').to(g.V('mary'))", {}, function (err, results) {
                if (err)
                    return console.error(err);
                console.log(JSON.stringify(results));
                console.log();
                console.log('Running Count');
                client.execute("g.V().count()", {}, function (err, results) {
                    if (err)
                        return console.error(err);
                    console.log(JSON.stringify(results));
                    console.log();
                });
            });
        });
    });
});
//# sourceMappingURL=app.js.map