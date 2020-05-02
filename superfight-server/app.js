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
    catalogue = db.collection('catalogue');
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
    if (playerId && playerId.length >= 3 && playerList[0].id === playerId) {
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

function newGame(socket) {
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

  io.emit('updateGameState', updatePackage);
  if (phase.phaseName === 'SELECTING') {
    io.to(phase.playerA.id).emit('updatePrivateState', [
      'card1',
      'card2',
      'card3',
    ]);
    io.to(phase.playerB.id).emit('updatePrivateState', [
      'card4',
      'card5',
      'card6',
    ]);
  }
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
