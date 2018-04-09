const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const mongoose = require('mongoose');
const Command = require('./model/command');

/* Connect to database */
(async function () {
  /* await */mongoose.connect('mongodb://156.35.98.110:32768/persistence')
  const db = mongoose.connection
  db.on('error', err => console.error('connection error:', err))
  db.once('open', () => console.info('Connected to the database.'))
  db.once('disconnected', () => console.info('Disconnected from the database.'))
})()


/* App server */
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
wss.broadcast = function broadcast(data, notme) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client.user && client !== notme) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.getUniqueID = function b(a) { return a ? (0 | Math.random() * 16).toString(16) : ("guest-" + 1e7).replace(/1|0/g, b) }

const controllers = {
  'none': function (message) {
    console.log('[%s] Mensaje de texto recibido: %s', this.id, message)
  },
  'notfound': function (message) {
    console.error('No existe un manejador para el mensaje:', message)
  },
  'user': require('./controller/user'),
  'canvas': require('./controller/canvas'),
  'chat': require('./controller/chat'),
  'p2pchat': require('./controller/p2pchat'),
}

wss.on('connection', function connection(ws, req) {
  ws.server = wss
  ws.id = wss.getUniqueID();
  console.log('connected: %s from %s', ws.id, req.connection.remoteAddress)

  ws.on('close', function close() {
    console.log('disconnected: %s', this.id)
  })

  ws.on('message', async function incoming(message) {
    const cmd = getCommand(message)
    if (!checkAuth(this, cmd)) {
      return
    }
    const controller = controllers[cmd.topic] ? controllers[cmd.topic] : controllers['notfound']
    const res = typeof controller === 'function' ? await controller.apply(this, [cmd.fn]) : await controller[cmd.fn].apply(this, cmd.args)
    if (res) {
      this.send(JSON.stringify(res))
    }
  })
})

server.listen(port, () => console.log('Listening on %d', server.address().port))

function getCommand(message) {
  if (message[0] === '{' || message[0] === '[') {
    try {
      const obj = JSON.parse(message)
      if (obj.topic)
        return obj;
    } catch (err) { }
  }
  return { topic: 'none', fn: message };
}

function checkAuth(ws, command) {
  if (ws.user || command.topic === 'none' || (command.topic === 'user' && 'register|login'.indexOf(command.fn) >= 0))
    return true;

  ws.send(JSON.stringify(new Command('user', 'requestAuth', [])))
  return false;
}