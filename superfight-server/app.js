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
var whiteDeck = [];
var blackDeck = [];
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
    catalogue.find({}).forEach((card) => {
      if (card.color === 'white') {
        whiteDeck.push(card);
      } else if (card.color === 'black') {
        blackDeck.push(card);
      }
    });
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
    playerList = playerList.filter((player) => player.id !== playerId);
    socket.emit('listPlayers', playerList);
    updatePlayerList(socket);
  });

  socket.on('setName', (name) => {
    console.log(`${playerId} identified as: ${name}`);
    const player = { id: playerId, name: name };
    player.isLeader = playerList.length === 0;
    playerList.push(player);
    socket.emit('listPlayers', playerList);
    updatePlayerList();
  });

  socket.on('drawWhite', () => {
    if (whiteDeck.length) {
      const whiteCard = whiteDeck.pop();
      console.log(whiteCard);
      socket.emit('getCard', whiteCard);
    }
  });
}

function updatePlayerList() {
  io.emit('listPlayers', playerList);
  console.log('CURRENT PLAYERS\n---------------');
  if (!playerList.length) {
    console.log('NONE');
  }
  playerList.forEach((player) => {
    console.log(`${player.name} : ${player.id}`);
  });
  console.log('---------------');
}
