const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);
const MongoClient = require('mongodb').MongoClient;

Http.listen(3000, () => {
  console.log('Listening at :3000...');
});

const mongoConnectionString = 'mongodb://localhost:27017';
var db;
var catalogue;
var playerList = [];

MongoClient.connect(
  mongoConnectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    catalogue = db.collection('catalogue');
    run();
  }
);

function run() {
  io.on('connection', (socket) => {
    userConnect(socket);
  });
}

function userConnect(socket) {
  const playerId = socket.id;
  console.log('a player connected: ' + playerId);
  socket.on('disconnect', () => {
    console.log('a player disconnected: ' + playerId);
  });
  socket.on('setName', (name) => {
    playerList.push({ id: playerId, name: name });
    listPlayers();
  });
}

function listPlayers() {
  playerList.forEach((player) => {
    console.log(`${player.name} : ${player.id}`);
  });
}
