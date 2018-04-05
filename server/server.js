const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const app = express()
const port = process.env.PORT || '80'
app.set('port', port)
app.use(express.static(__dirname + '/public'))
app.get('/', function (req, res) {
    res.sendfile('public/index.html')
})

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.getUniqueID = function b(a) { return a ? (0 | Math.random() * 16).toString(16) : ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0/g, b) }

wss.on('connection', function connection(ws, req) {
    ws.id = wss.getUniqueID();
    console.log('connected: %s from %s', ws.id, req.connection.remoteAddress)

    ws.on('close', function close() {
        console.log('disconnected: %s', this.id)
    })

    ws.on('message', function incoming(message) {
        console.log('received: %s', message, this == ws)
        this.send(message)

        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

    })
    ws.send('something')
})

server.listen(port, () => console.log('Listening on %d', server.address().port))


// ---
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
var dburl = "mongodb://156.35.98.110:32771/wspaint";

MongoClient.connect(dburl, function (err, db) {
    if (err) throw err;
    console.log("Database created!");

    var dbo = db.db("wspaint");
    dbo.createCollection("drawings", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });

    //db.close();
});



/*
const MyCollection = db.collection('MyCollection');
const result = await MyCollection.find(query).toArray();
*/


/*
db.createUser({ user: 'david', pwd: 'Kv6CE4mg;6q**S98', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
docker run -d --restart=always --name mongo -v mongo:/data/db -p 27017:27017 mongo --auth --bind_ip_all
*/