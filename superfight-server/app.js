const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');

Http.listen(3000, () => {
  console.log('Listening at :3000...');
});

const mongoConnectionString = 'mongodb://localhost:27017';
var db;
var playerList = [];
var masterGameState = {};
var matchupList;

MongoClient.connect(
  mongoConnectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    io.on('connection', (socket) => {
      userConnect(socket);
    });
  }
);

function userConnect(socket) {
  const playerId = socket.id;
  console.log('a player connected: ' + playerId);

  socket.on('disconnect', () => {
    console.log('a player disconnected: ' + playerId);
    playerList = playerList.filter((player) => player.id !== playerId);
    updatePlayerList();
  });

  socket.on('setName', (name) => {
    console.log(`${playerId} identified as: ${name}`);
    const player = { id: playerId, name: name };
    playerList.push(player);
    updatePlayerList();
  });

  socket.on('newGame', () => {
    if (playerId && playerList.length >= 3 && playerList[0].id === playerId) {
      newGame(socket);
    } else {
      console.log('cannot start game');
    }
  });
}

function updatePlayerList() {
  console.log('CURRENT PLAYERS\n---------------');
  if (!playerList.length) {
    console.log('NONE');
  } else {
    playerList[0].isLeader = true;
    playerList.forEach((player) => {
      console.log(
        `${player.name} : ${player.id} ${player.isLeader ? '(leader)' : ''}`
      );
    });
  }
  console.log('---------------');
  io.emit('listPlayers', playerList);
}

async function newGame(socket) {
  await shuffleWhiteDeck();
  await shuffleBlackDeck();
  masterGameState.players = playerList.map((player) => {
    return {
      ...player,
      timesPlayed: 0,
      score: 0,
    };
  });
  matchupList = [];
  playerList.forEach((playerA) => {
    playerList.forEach((playerB) => {
      if (playerA.id !== playerB.id) {
        matchupList.push({
          playerA: playerA,
          playerB: playerB,
          timesPlayed: 0,
        });
      }
    });
  });
  masterGameState.scoreboard = generateFreshScoreboard(playerList);
  masterGameState.phase = findMatchup();
  updateClients();
}

function updateClients() {
  const phase = masterGameState.phase;
  const updatePackage = {
    phase: phase,
    scoreboard: masterGameState.scoreboard,
  };

  io.emit('updatePublicState', updatePackage);
  if (phase.phaseName === 'SELECTING') {
    if (masterGameState.whiteDeck.length < 6) {
      shuffleWhiteDeck();
    }
    if (masterGameState.blackDeck.length < 6) {
      shuffleBlackDeck();
    }
    const packageA = {
      whiteOptions: [
        masterGameState.whiteDeck.pop(),
        masterGameState.whiteDeck.pop(),
        masterGameState.whiteDeck.pop(),
      ],
      blackOptions: [
        masterGameState.blackDeck.pop(),
        masterGameState.blackDeck.pop(),
        masterGameState.blackDeck.pop(),
      ],
    };
    const packageB = {
      whiteOptions: [
        masterGameState.whiteDeck.pop(),
        masterGameState.whiteDeck.pop(),
        masterGameState.whiteDeck.pop(),
      ],
      blackOptions: [
        masterGameState.blackDeck.pop(),
        masterGameState.blackDeck.pop(),
        masterGameState.blackDeck.pop(),
      ],
    };
    io.to(phase.playerA.id).emit('updatePrivateState', packageA);
    io.to(phase.playerB.id).emit('updatePrivateState', packageB);
  }
}

async function shuffleWhiteDeck() {
  masterGameState.whiteDeck = _.shuffle(
    await db.collection('whiteCatalogue').find().toArray()
  );
}

async function shuffleBlackDeck() {
  masterGameState.blackDeck = _.shuffle(
    await db.collection('blackCatalogue').find().toArray()
  );
}

/**
 * Finds a suitable matchup,
 * adjusts matchupList accordingly,
 * returns the resulting selecting phase,
 */
function findMatchup() {
  const firstPlayer = masterGameState.players[0];
  let secondPlayer;
  let matchupFound = false;
  for (let i = 0; i < matchupList.length; i++) {
    if (!matchupFound) {
      if (matchupList[i].playerA.id === firstPlayer.id) {
        secondPlayer = matchupList[i].playerB;
        matchupList[i].timesPlayed++;
        matchupFound = true;
      } else if (matchupList.playerB.id === firstPlayer.id) {
        secondPlayer = matchupList[i].playerA;
        matchupList[i].timesPlayed++;
        matchupFound = true;
      }
    }
    if (
      matchupFound &&
      i < matchupList.length - 1 &&
      matchupList[i] >= matchupList[i + 1]
    ) {
      //shifting matchup to proper place in queue
      const temp = matchupList[i];
      matchupList[i] = matchupList[i + 1];
      matchupList[i + 1] = temp;
    }
  }
  return generateSelectingPhase(firstPlayer, secondPlayer);
}

function generateSelectingPhase(playerA, playerB) {
  return {
    phaseName: 'SELECTING',
    playerA: playerA,
    playerB: playerB,
  };
}

function generateFreshScoreboard(players) {
  return players.map((player) => {
    return { ...player, score: 0 };
  });
}
