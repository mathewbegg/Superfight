const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);
const MongoClient = require('mongodb').MongoClient;

Http.listen(3000, () => {
  console.log('Listening at :3000...');
});

const mongoConnectionString = 'mongodb://localhost:27017';
let db;
let catalogue;
let whiteDeck = [];
let blackDeck = [];
let playerList = [];
let gameState;

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

  socket.on('newGame', () => {
    if (playerId && playerList[0] && playerList[0].id === playerId) {
      console.log('starting new game');
      newGame(socket);
    } else {
      console.log('non-leaders cannot start the game');
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

function newGame(socket) {
  const freshScore = playerList.map((player) => {
    return {
      name: player.name,
      id: player.id,
      score: 0,
    };
  });

  gameState = {
    stage: {
      stageName: 'SELECTING',
      playerA: {
        name: 'testPlayer1',
        id: 'testID',
        whiteOptions: ['testWhite1'],
        blackOptions: ['testBlack2'],
      },
      playerB: {
        name: 'testPlayer2',
        id: 'testID',
        whiteOptions: ['testWhite2'],
        blackOptions: ['testBlack2'],
      },
    },
    scoreBoard: freshScore,
  };

  socket.emit('updateGameState', gameState);
}
